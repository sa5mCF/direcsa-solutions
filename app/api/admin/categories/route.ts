import { NextRequest } from 'next/server';
import { categoryController } from '@/src/modules/category/category.controller';

export async function POST(req: NextRequest) {
    return categoryController.create(req);
}
