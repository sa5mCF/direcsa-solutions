import { prisma } from '@/src/lib/prisma';
import { Prisma } from '@prisma/client';

export class BrandService {
    async findAll(onlyActive = false) {
        return prisma.brand.findMany({
            where: onlyActive ? { isActive: true } : undefined,
            orderBy: { name: 'asc' },
        });
    }

    async findById(id: string) {
        return prisma.brand.findUnique({
            where: { id },
        });
    }

    async create(data: Prisma.BrandUncheckedCreateInput) {
        return prisma.brand.create({
            data,
        });
    }

    async update(id: string, data: Prisma.BrandUncheckedUpdateInput) {
        return prisma.brand.update({
            where: { id },
            data,
        });
    }

    async delete(id: string) {
        return prisma.brand.delete({
            where: { id },
        });
    }
}

export const brandService = new BrandService();
