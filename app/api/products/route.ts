import { NextRequest } from 'next/server';
import { productController } from '@/src/modules/product/product.controller';

export async function GET(req: NextRequest) {
    return productController.getAll(req);
}

export async function POST(req: NextRequest) {
    return productController.create(req);
}
