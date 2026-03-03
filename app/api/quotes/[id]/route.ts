import { NextRequest } from 'next/server';
import { quoteController } from '@/src/modules/quote/quote.controller';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return quoteController.getById(req, id);
}
