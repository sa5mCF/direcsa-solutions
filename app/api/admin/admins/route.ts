import { NextRequest } from 'next/server';
import { adminController } from '@/src/modules/admin/admin.controller';

/**
 * @swagger
 * /api/admin/admins:
 *   get:
 *     summary: Obtener lista de administradores
 *     description: Requiere permiso CREATE_ADMIN
 *     tags: [Admin - Admins]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Lista de administradores
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 admins:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AuthUser'
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Permisos insuficientes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     summary: Crear un nuevo administrador
 *     description: Requiere permiso CREATE_ADMIN
 *     tags: [Admin - Admins]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminInput'
 *     responses:
 *       201:
 *         description: Administrador creado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 admin:
 *                   $ref: '#/components/schemas/AuthUser'
 *                 message:
 *                   type: string
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Permisos insuficientes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET(req: NextRequest) {
    return adminController.getAdmins(req);
}

export async function POST(req: NextRequest) {
    return adminController.createAdmin(req);
}
