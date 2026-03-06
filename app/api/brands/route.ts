import { NextRequest } from 'next/server';
import { brandController } from '@/src/modules/brand/brand.controller';

export async function GET(req: NextRequest) {
    return brandController.getAll(req);
}
