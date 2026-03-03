import { NextRequest, NextResponse } from 'next/server';
import { quoteService } from './quote.service';
import { verifyToken } from '@/src/lib/auth/jwt';
import { z } from 'zod';

const quoteSchema = z.object({
    notes: z.string().optional(),
    items: z.array(z.object({
        productId: z.string().min(1),
        quantity: z.number().positive(),
        unitPrice: z.number().nonnegative(),
    })).min(1, 'La cotización debe tener al menos un item'),
});

export class QuoteController {
    private async getAuth(req: NextRequest) {
        const token = req.cookies.get('token')?.value ?? req.headers.get('authorization')?.replace('Bearer ', '');
        if (!token) return null;
        try {
            return await verifyToken(token);
        } catch {
            return null;
        }
    }

    async getAll(req: NextRequest) {
        try {
            const auth = await this.getAuth(req);
            if (!auth) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

            const userId = auth.role === 'ADMIN' ? undefined : auth.sub;
            const quotes = await quoteService.findAll(userId);
            return NextResponse.json({ quotes });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error al obtener cotizaciones';
            return NextResponse.json({ error: message }, { status: 500 });
        }
    }

    async getById(req: NextRequest, id: string) {
        try {
            const auth = await this.getAuth(req);
            if (!auth) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

            const quote = await quoteService.findById(id);
            if (!quote) return NextResponse.json({ error: 'Cotización no encontrada' }, { status: 404 });

            // Security check
            if (auth.role !== 'ADMIN' && quote.userId !== auth.sub) {
                return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
            }

            return NextResponse.json({ quote });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error al obtener cotización';
            return NextResponse.json({ error: message }, { status: 500 });
        }
    }

    async create(req: NextRequest) {
        try {
            const auth = await this.getAuth(req);
            if (!auth) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

            const body = await req.json();
            const validated = quoteSchema.parse(body);

            const quote = await quoteService.create({
                ...validated,
                userId: auth.sub,
            });

            return NextResponse.json({ quote }, { status: 201 });
        } catch (error) {
            const message = error instanceof z.ZodError
                ? error.issues[0].message
                : error instanceof Error ? error.message : 'Error al crear cotización';
            return NextResponse.json({ error: message }, { status: 400 });
        }
    }

    async updateStatus(req: NextRequest, id: string) {
        try {
            const auth = await this.getAuth(req);
            if (!auth || auth.role !== 'ADMIN') {
                return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
            }

            const { status } = await req.json();
            if (!status) return NextResponse.json({ error: 'Estado requerido' }, { status: 400 });

            const quote = await quoteService.updateStatus(id, status);
            return NextResponse.json({ quote });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error al actualizar estado';
            return NextResponse.json({ error: message }, { status: 400 });
        }
    }
}

export const quoteController = new QuoteController();
