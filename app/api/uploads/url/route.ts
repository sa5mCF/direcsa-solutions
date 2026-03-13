import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client, BUCKET_NAME } from "@/lib/s3";

/**
 * @swagger
 * /api/uploads/url:
 *   post:
 *     summary: Generar URL pre-firmada para subir imagen a S3
 *     description: >
 *       Genera una URL pre-firmada de AWS S3 válida por 60 segundos.
 *       También retorna las URLs públicas para las variantes de la imagen
 *       (original, optimizada, thumbnail).
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UploadUrlInput'
 *     responses:
 *       200:
 *         description: URL pre-firmada generada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UploadUrlResponse'
 *       400:
 *         description: Faltan campos requeridos o entidad inválida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error al generar la URL
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function POST(request: Request) {
  try {
    const { filename, entity } = await request.json();

    if (!filename || !entity) {
      return NextResponse.json(
        { error: "Filename and entity are required" },
        { status: 400 }
      );
    }

    if (entity !== "product" && entity !== "brand") {
      return NextResponse.json(
        { error: "Invalid entity type" },
        { status: 400 }
      );
    }

    const cleanFilename = filename.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const folder = entity === "product" ? "products" : "brands";
    const key = `${folder}/original/${cleanFilename}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    // Expiration: 60 seconds
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });

    // Base URL for public access
    // Fallback to standard S3 URL if AWS_S3_PUBLIC_URL is not provided
    const region = process.env.AWS_REGION || "us-east-1";
    const baseUrl = process.env.AWS_S3_PUBLIC_URL || `https://${BUCKET_NAME}.s3.${region}.amazonaws.com`;
    
    const originalUrl = `${baseUrl}/${folder}/original/${cleanFilename}`;
    const optimizedUrl = `${baseUrl}/${folder}/optimized/${cleanFilename}`;
    const thumbnailUrl = `${baseUrl}/${folder}/thumbnails/${cleanFilename}`;

    return NextResponse.json({
      uploadUrl,
      originalUrl,
      optimizedUrl,
      thumbnailUrl,
    });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
