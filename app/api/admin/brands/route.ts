import { NextRequest } from 'next/server';
import { brandController } from '@/src/modules/brand/brand.controller';

/**
 * @swagger
 * /api/admin/brands:
 *   post:
 *     summary: Crear una nueva marca
 *     tags: [Admin - Brands]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BrandInput'
 *     responses:
 *       201:
 *         description: Marca creada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 brand:
 *                   $ref: '#/components/schemas/Brand'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function POST(req: NextRequest) {
    return brandController.create(req);
}
