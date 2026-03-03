import { NextRequest } from 'next/server';
import { contactController } from '@/src/modules/contact/contact.controller';

export async function GET(req: NextRequest) {
    return await contactController.findAll(req);
}
