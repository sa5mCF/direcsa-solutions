import { NextRequest } from 'next/server';
import { brandController } from '@/src/modules/brand/brand.controller';

/**
 * @swagger
 * /api/brands:
 *   get:
 *     summary: Obtener todas las marcas
 *     tags: [Brands]
 *     parameters:
 *       - in: query
 *         name: active
 *         schema:
 *           type: string
 *           enum: ['true', 'false']
 *         description: Filtrar solo marcas activas (active=true)
 *     responses:
 *       200:
 *         description: Lista de marcas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 brands:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Brand'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET(req: NextRequest) {
    return brandController.getAll(req);
}
