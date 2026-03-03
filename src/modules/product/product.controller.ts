import { NextRequest, NextResponse } from 'next/server';
import { productService } from './product.service';
import { z } from 'zod';

const productSchema = z.object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    description: z.string().optional().nullable(),
    sku: z.string().min(1, 'El SKU es requerido'),
    unit: z.string().optional(),
    dealerPriceUsd: z.number().optional(),
    promoPriceUsd: z.number().optional(),
    priceMxnExVat: z.number().optional(),
    priceMxnIncVat: z.number().optional(),
    priceMxn: z.number().optional(),
    priceUsd: z.number().optional(),
    discount: z.number().optional(),
    brandId: z.string().min(1, 'El ID de marca es requerido'),
    categoryId: z.string().min(1, 'El ID de categoría es requerido'),
    isActive: z.boolean().optional(),
});

export class ProductController {
    async getAll(req: NextRequest) {
        try {
            const { searchParams } = new URL(req.url);
            const onlyActive = searchParams.get('active') === 'true';
            const products = await productService.findAll(onlyActive);
            return NextResponse.json({ products });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error al obtener productos';
            return NextResponse.json({ error: message }, { status: 500 });
        }
    }

    async getById(_req: NextRequest, id: string) {
        try {
            const product = await productService.findById(id);
            if (!product) {
                return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
            }
            return NextResponse.json({ product });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error al obtener producto';
            return NextResponse.json({ error: message }, { status: 500 });
        }
    }

    async create(req: NextRequest) {
        try {
            const body = await req.json();
            const validated = productSchema.parse(body);

            const product = await productService.create(validated);

            return NextResponse.json({ product }, { status: 201 });
        } catch (error) {
            const message = error instanceof z.ZodError
                ? error.issues[0].message
                : error instanceof Error ? error.message : 'Error al crear producto';
            return NextResponse.json({ error: message }, { status: 400 });
        }
    }

    async update(req: NextRequest, id: string) {
        try {
            const body = await req.json();
            const validated = productSchema.partial().parse(body);

            const product = await productService.update(id, validated);

            return NextResponse.json({ product });
        } catch (error) {
            const message = error instanceof z.ZodError
                ? error.issues[0].message
                : error instanceof Error ? error.message : 'Error al actualizar producto';
            const status = message.includes('encontrado') ? 404 : 400;
            return NextResponse.json({ error: message }, { status });
        }
    }

    async delete(_req: NextRequest, id: string) {
        try {
            await productService.delete(id);
            return NextResponse.json({ message: 'Producto eliminado' });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error al eliminar producto';
            const status = message.includes('encontrado') ? 404 : 500;
            return NextResponse.json({ error: message }, { status });
        }
    }
}

export const productController = new ProductController();
