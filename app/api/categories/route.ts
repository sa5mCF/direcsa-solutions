import { NextRequest } from 'next/server';
import { categoryController } from '@/src/modules/category/category.controller';

export async function GET(req: NextRequest) {
    return categoryController.getAll(req);
}
