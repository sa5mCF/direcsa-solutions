import { NextRequest, NextResponse } from 'next/server';
import { contactService } from './contact.service';
import { z } from 'zod';

const contactSchema = z.object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    email: z.string().email('El email no es válido'),
    phone: z.string().optional(),
    description: z.string().min(1, 'La descripción es requerida'),
});

export class ContactController {
    async create(req: NextRequest) {
        try {
            const body = await req.json();
            const validated = contactSchema.parse(body);

            const contact = await contactService.create({
                ...validated,
                updatedAt: null,
            });

            return NextResponse.json(
                { contact, message: 'Mensaje enviado exitosamente' },
                { status: 201 },
            );
        } catch (error) {
            const message = error instanceof z.ZodError
                ? error.issues[0].message
                : error instanceof Error ? error.message : 'Error al enviar mensaje';
            return NextResponse.json({ error: message }, { status: 400 });
        }
    }

    async findAll(_req: NextRequest) {
        try {
            const contacts = await contactService.findAll();
            return NextResponse.json({ contacts });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error al obtener mensajes';
            return NextResponse.json({ error: message }, { status: 500 });
        }
    }

    async update(req: NextRequest, id: string) {
        try {
            const body = await req.json();
            const { isRead } = body;

            // Get user ID from token for audit
            const token = req.cookies.get('token')?.value;
            let userId = null;
            if (token) {
                try {
                    const { verifyToken } = await import('@/src/lib/auth/jwt');
                    const payload = await verifyToken(token);
                    userId = payload.sub;
                } catch (e) {
                    console.error('Error verifying token for audit:', e);
                }
            }

            const contact = await contactService.update(id, {
                isRead,
                updatedAt: new Date(),
                updatedBy: userId,
            });

            return NextResponse.json({ contact });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error al actualizar mensaje';
            return NextResponse.json({ error: message }, { status: 400 });
        }
    }
}

export const contactController = new ContactController();
