import { NextRequest } from 'next/server';
import { contactController } from '@/src/modules/contact/contact.controller';

/**
 * @swagger
 * /api/admin/contacts:
 *   get:
 *     summary: Obtener todos los mensajes de contacto
 *     tags: [Admin - Contacts]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Lista de mensajes de contacto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 contacts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ContactMessage'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET(req: NextRequest) {
    return await contactController.findAll(req);
}
