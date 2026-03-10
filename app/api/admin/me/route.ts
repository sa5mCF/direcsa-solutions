import { NextRequest } from 'next/server';
import { adminController } from '@/src/modules/admin/admin.controller';

export async function GET(req: NextRequest) {
    return adminController.getMe(req);
}
