import { NextRequest } from 'next/server';
import { quoteController } from '@/src/modules/quote/quote.controller';

/**
 * @swagger
 * /api/quotes/{id}:
 *   get:
 *     summary: Obtener una cotización por ID
 *     description: Los admins pueden ver cualquier cotización. Los compradores solo las suyas.
 *     tags: [Quotes]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la cotización
 *     responses:
 *       200:
 *         description: Cotización encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 quote:
 *                   $ref: '#/components/schemas/Quote'
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Cotización no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return quoteController.getById(req, id);
}
