import { NextRequest } from 'next/server';
import { authController } from '@/src/modules/auth/auth.controller';

/**
 * @swagger
 * /api/auth:
 *   post:
 *     summary: Autenticación (login, registro o logout)
 *     description: >
 *       Endpoint unificado de autenticación. Usa el campo `action` en el body
 *       para indicar la operación: `register`, `login` o `logout`.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - title: Register
 *                 type: object
 *                 required: [action, name, email, password]
 *                 properties:
 *                   action:
 *                     type: string
 *                     enum: [register]
 *                   name:
 *                     type: string
 *                     minLength: 2
 *                   email:
 *                     type: string
 *                     format: email
 *                   password:
 *                     type: string
 *                     minLength: 6
 *               - title: Login
 *                 type: object
 *                 required: [action, email, password]
 *                 properties:
 *                   action:
 *                     type: string
 *                     enum: [login]
 *                   email:
 *                     type: string
 *                     format: email
 *                   password:
 *                     type: string
 *               - title: Logout
 *                 type: object
 *                 required: [action]
 *                 properties:
 *                   action:
 *                     type: string
 *                     enum: [logout]
 *     responses:
 *       200:
 *         description: Login o logout exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/AuthUser'
 *                 token:
 *                   type: string
 *                 message:
 *                   type: string
 *       201:
 *         description: Registro exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/AuthUser'
 *                 message:
 *                   type: string
 *       400:
 *         description: Acción no válida o datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Credenciales inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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
