import { prisma } from '@/src/lib/prisma';
import { Prisma } from '@prisma/client';

export class ProductService {
    async findAll(onlyActive = false) {
        return prisma.product.findMany({
            where: onlyActive ? { isActive: true } : undefined,
            orderBy: { createdAt: 'desc' },
            include: {
                brand: true,
                category: true,
            }
        });
    }

    async findById(id: string) {
        return prisma.product.findUnique({
            where: { id },
            include: {
                brand: true,
                category: true,
            }
        });
    }

    async findBySku(sku: string) {
        return prisma.product.findUnique({
            where: { sku },
            include: {
                brand: true,
                category: true,
            }
        });
    }

    async create(data: Prisma.ProductUncheckedCreateInput) {
        return prisma.product.create({
            data,
            include: {
                brand: true,
                category: true,
            }
        });
    }

    async update(id: string, data: Prisma.ProductUncheckedUpdateInput) {
        return prisma.product.update({
            where: { id },
            data,
            include: {
                brand: true,
                category: true,
            }
        });
    }

    async delete(id: string) {
        return prisma.product.delete({
            where: { id },
        });
    }
}

export const productService = new ProductService();
