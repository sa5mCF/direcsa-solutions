import { prisma } from '@/src/lib/prisma';
import { Prisma } from '@prisma/client';

export class CategoryService {
    async findAll(onlyActive = false) {
        return prisma.category.findMany({
            where: onlyActive ? { isActive: true } : undefined,
            orderBy: { name: 'asc' },
            include: {
                parent: true,
                children: true,
            }
        });
    }

    async findById(id: string) {
        return prisma.category.findUnique({
            where: { id },
            include: {
                parent: true,
                children: true,
            }
        });
    }

    async create(data: Prisma.CategoryUncheckedCreateInput) {
        return prisma.category.create({
            data,
        });
    }

    async update(id: string, data: Prisma.CategoryUncheckedUpdateInput) {
        return prisma.category.update({
            where: { id },
            data,
        });
    }

    async delete(id: string) {
        // Note: Prisma will handle Cascade if configured, otherwise we might need to handle children
        return prisma.category.delete({
            where: { id },
        });
    }
}

export const categoryService = new CategoryService();
