import { NextRequest } from 'next/server';
import { contactController } from '@/src/modules/contact/contact.controller';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return contactController.update(req, id);
}
