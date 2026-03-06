import { NextRequest } from 'next/server';
import { categoryController } from '@/src/modules/category/category.controller';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return categoryController.update(req, id);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return categoryController.delete(req, id);
}
