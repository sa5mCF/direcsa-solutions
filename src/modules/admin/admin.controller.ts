import { NextRequest, NextResponse } from 'next/server';
import { adminService } from './admin.service';
import { verifyToken } from '@/src/lib/auth/jwt';
import { PermissionType } from '@prisma/client';
import { z } from 'zod';

const createAdminSchema = z.object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    email: z.string().email('El email no es válido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export class AdminController {
    private async getSession(req: NextRequest) {
        const token = req.cookies.get('token')?.value || req.headers.get('authorization')?.split(' ')[1];
        if (!token) return null;
        try {
            return await verifyToken(token);
        } catch {
            return null;
        }
    }

    async getAdmins(req: NextRequest) {
        const session = await this.getSession(req);
        if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

        const canCreate = await adminService.hasPermission(session.sub, PermissionType.CREATE_ADMIN);
        if (!canCreate) return NextResponse.json({ error: 'Permisos insuficientes' }, { status: 403 });

        try {
            const admins = await adminService.getAdmins();
            return NextResponse.json({ admins });
        } catch (error: any) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }

    async createAdmin(req: NextRequest) {
        const session = await this.getSession(req);
        if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

        const canCreate = await adminService.hasPermission(session.sub, PermissionType.CREATE_ADMIN);
        if (!canCreate) return NextResponse.json({ error: 'Permisos insuficientes' }, { status: 403 });

        try {
            const body = await req.json();
            const validated = createAdminSchema.parse(body);

            const admin = await adminService.createAdmin(validated);
            return NextResponse.json({ admin, message: 'Administrador creado exitosamente' }, { status: 201 });
        } catch (error: any) {
            const message = error instanceof z.ZodError 
                ? error.issues[0].message 
                : error.message || 'Error al crear administrador';
            return NextResponse.json({ error: message }, { status: 400 });
        }
    }

    async getMe(req: NextRequest) {
        const session = await this.getSession(req);
        if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

        try {
            const permissions = await adminService.getUserPermissions(session.sub);
            return NextResponse.json({ 
                user: {
                    id: session.sub,
                    email: session.email,
                    role: session.role
                },
                permissions 
            });
        } catch (error: any) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }
}

export const adminController = new AdminController();
