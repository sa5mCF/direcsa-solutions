import { NextRequest } from 'next/server';
import { adminController } from '@/src/modules/admin/admin.controller';

export async function GET(req: NextRequest) {
    return adminController.getAdmins(req);
}

export async function POST(req: NextRequest) {
    return adminController.createAdmin(req);
}
