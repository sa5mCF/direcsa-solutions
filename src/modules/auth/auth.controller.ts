import { NextRequest, NextResponse } from 'next/server';
import { authService } from './auth.service';
import { toAuthUser } from './auth.types';
import { z } from 'zod';

const registerSchema = z.object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    email: z.string().email('El email no es válido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

const loginSchema = z.object({
    email: z.string().email('El email no es válido'),
    password: z.string().min(1, 'La contraseña es requerida'),
});

export class AuthController {
    async register(req: NextRequest) {
        try {
            const body = await req.json();
            const validated = registerSchema.parse(body);

            const { user } = await authService.register(validated);

            return NextResponse.json(
                { user: toAuthUser(user), message: 'Cuenta creada exitosamente' },
                { status: 201 },
            );
        } catch (error) {
            const message = error instanceof z.ZodError
                ? error.issues[0].message
                : error instanceof Error ? error.message : 'Error al registrar usuario';
            return NextResponse.json({ error: message }, { status: 400 });
        }
    }

    async login(req: NextRequest) {
        try {
            const body = await req.json();
            const validated = loginSchema.parse(body);

            const { user, token } = await authService.login(validated);

            const response = NextResponse.json(
                { user: toAuthUser(user), token, message: 'Sesión iniciada' },
                { status: 200 },
            );

            // Set HTTP-only cookie for SSR auth
            response.cookies.set('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7, // 7 days
                path: '/',
            });

            return response;
        } catch (error) {
            const message = error instanceof z.ZodError
                ? error.issues[0].message
                : error instanceof Error ? error.message : 'Error al iniciar sesión';
            return NextResponse.json({ error: message }, { status: 401 });
        }
    }

    async logout(_req: NextRequest) {
        const response = NextResponse.json({ message: 'Sesión cerrada' });
        response.cookies.delete('token');
        return response;
    }
}

export const authController = new AuthController();
