import { NextRequest } from 'next/server';
import { contactController } from '@/src/modules/contact/contact.controller';

export async function POST(req: NextRequest) {
    return await contactController.create(req);
}
