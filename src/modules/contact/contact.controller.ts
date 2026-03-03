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

            const contact = await contactService.create(validated);

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
            return NextResponse.json(contacts);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error al obtener mensajes';
            return NextResponse.json({ error: message }, { status: 500 });
        }
    }
}

export const contactController = new ContactController();
