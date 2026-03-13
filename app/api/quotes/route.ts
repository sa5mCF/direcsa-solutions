import { NextRequest } from 'next/server';
import { quoteController } from '@/src/modules/quote/quote.controller';

/**
 * @swagger
 * /api/quotes:
 *   get:
 *     summary: Obtener cotizaciones del usuario autenticado
 *     description: Los admins ven todas las cotizaciones. Los compradores solo las suyas.
 *     tags: [Quotes]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Lista de cotizaciones
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 quotes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Quote'
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     summary: Crear una nueva cotización
 *     tags: [Quotes]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/QuoteInput'
 *     responses:
 *       201:
 *         description: Cotización creada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 quote:
 *                   $ref: '#/components/schemas/Quote'
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
 */
export async function GET(req: NextRequest) {
    return quoteController.getAll(req);
}

export async function POST(req: NextRequest) {
    return quoteController.create(req);
}
