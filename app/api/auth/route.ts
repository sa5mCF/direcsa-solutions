import { NextRequest } from 'next/server';
import { authController } from '@/src/modules/auth/auth.controller';

export async function POST(req: NextRequest) {
    const body = await req.clone().json().catch(() => ({}));
    const action = body?.action;

    if (action === 'register') {
        return authController.register(req);
    }
    if (action === 'login') {
        return authController.login(req);
    }
    if (action === 'logout') {
        return authController.logout(req);
    }

    return Response.json({ error: 'Acción no válida. Usa: register, login, logout' }, { status: 400 });
}
