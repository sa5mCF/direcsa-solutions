import { NextRequest } from 'next/server';
import { contactController } from '@/src/modules/contact/contact.controller';

/**
 * @swagger
 * /api/admin/contacts/{id}:
 *   patch:
 *     summary: Actualizar un mensaje de contacto (marcar como leído)
 *     tags: [Admin - Contacts]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del mensaje de contacto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isRead:
 *                 type: boolean
 *                 description: Marcar como leído o no leído
 *     responses:
 *       200:
 *         description: Mensaje actualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 contact:
 *                   $ref: '#/components/schemas/ContactMessage'
 *       400:
 *         description: Error al actualizar
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return contactController.update(req, id);
}
