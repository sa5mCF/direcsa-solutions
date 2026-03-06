import { NextRequest, NextResponse } from 'next/server';
import { categoryService } from './category.service';
import { z } from 'zod';

const categorySchema = z.object({
    name: z.string().min(1, 'El nombre es requerido'),
    parentId: z.string().optional().nullable(),
    isActive: z.boolean().optional(),
});

export class CategoryController {
    async getAll(req: NextRequest) {
        try {
            const { searchParams } = new URL(req.url);
            const onlyActive = searchParams.get('active') === 'true';
            const categories = await categoryService.findAll(onlyActive);
            return NextResponse.json({ categories });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error al obtener categorías';
            return NextResponse.json({ error: message }, { status: 500 });
        }
    }

    async create(req: NextRequest) {
        try {
            const body = await req.json();
            const validated = categorySchema.parse(body);
            const category = await categoryService.create(validated);
            return NextResponse.json({ category }, { status: 201 });
        } catch (error) {
            const message = error instanceof z.ZodError
                ? error.issues[0].message
                : error instanceof Error ? error.message : 'Error al crear categoría';
            return NextResponse.json({ error: message }, { status: 400 });
        }
    }

    async update(req: NextRequest, id: string) {
        try {
            const body = await req.json();
            const validated = categorySchema.partial().parse(body);
            const category = await categoryService.update(id, validated);
            return NextResponse.json({ category });
        } catch (error) {
            const message = error instanceof z.ZodError
                ? error.issues[0].message
                : error instanceof Error ? error.message : 'Error al actualizar categoría';
            return NextResponse.json({ error: message }, { status: 400 });
        }
    }

    async delete(_req: NextRequest, id: string) {
        try {
            await categoryService.delete(id);
            return NextResponse.json({ message: 'Categoría eliminada' });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error al eliminar categoría';
            return NextResponse.json({ error: message }, { status: 500 });
        }
    }
}

export const categoryController = new CategoryController();
