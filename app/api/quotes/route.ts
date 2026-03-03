import { NextRequest } from 'next/server';
import { quoteController } from '@/src/modules/quote/quote.controller';

export async function GET(req: NextRequest) {
    return quoteController.getAll(req);
}

export async function POST(req: NextRequest) {
    return quoteController.create(req);
}
