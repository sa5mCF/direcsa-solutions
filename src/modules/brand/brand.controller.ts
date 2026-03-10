import { NextRequest, NextResponse } from 'next/server';
import { brandService } from './brand.service';
import { z } from 'zod';

const brandSchema = z.object({
    name: z.string().min(1, 'El nombre es requerido'),
    isActive: z.boolean().optional(),
    logoOriginal: z.string().optional().nullable(),
    logoOptimized: z.string().optional().nullable(),
    logoThumbnail: z.string().optional().nullable(),
});

export class BrandController {
    async getAll(req: NextRequest) {
        try {
            const { searchParams } = new URL(req.url);
            const onlyActive = searchParams.get('active') === 'true';
            const brands = await brandService.findAll(onlyActive);
            return NextResponse.json({ brands });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error al obtener marcas';
            return NextResponse.json({ error: message }, { status: 500 });
        }
    }

    async create(req: NextRequest) {
        try {
            const body = await req.json();
            const validated = brandSchema.parse(body);
            const brand = await brandService.create(validated);
            return NextResponse.json({ brand }, { status: 201 });
        } catch (error) {
            const message = error instanceof z.ZodError
                ? error.issues[0].message
                : error instanceof Error ? error.message : 'Error al crear marca';
            return NextResponse.json({ error: message }, { status: 400 });
        }
    }

    async update(req: NextRequest, id: string) {
        try {
            const body = await req.json();
            const validated = brandSchema.partial().parse(body);
            const brand = await brandService.update(id, validated);
            return NextResponse.json({ brand });
        } catch (error) {
            const message = error instanceof z.ZodError
                ? error.issues[0].message
                : error instanceof Error ? error.message : 'Error al actualizar marca';
            return NextResponse.json({ error: message }, { status: 400 });
        }
    }

    async delete(_req: NextRequest, id: string) {
        try {
            await brandService.delete(id);
            return NextResponse.json({ message: 'Marca eliminada' });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error al eliminar marca';
            return NextResponse.json({ error: message }, { status: 500 });
        }
    }
}

export const brandController = new BrandController();
