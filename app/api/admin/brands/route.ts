import { NextRequest } from 'next/server';
import { brandController } from '@/src/modules/brand/brand.controller';

export async function POST(req: NextRequest) {
    return brandController.create(req);
}
