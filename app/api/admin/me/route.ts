import { NextRequest } from 'next/server';
import { adminController } from '@/src/modules/admin/admin.controller';

/**
 * @swagger
 * /api/admin/me:
 *   get:
 *     summary: Obtener información del administrador autenticado
 *     description: Retorna los datos del usuario actual y sus permisos
 *     tags: [Admin - Admins]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Información del admin actual
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                 permissions:
 *                   type: array
 *                   items:
 *                     type: string
 *                     enum: [CREATE_ADMIN, MANAGE_PRODUCTS, VIEW_QUOTES, DELETE_MESSAGES]
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET(req: NextRequest) {
    return adminController.getMe(req);
}
