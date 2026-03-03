import { prisma } from '@/src/lib/prisma';
import { Prisma, QuoteStatus } from '@prisma/client';

export class QuoteService {
    async findAll(userId?: string) {
        return prisma.quote.findMany({
            where: userId ? { userId } : undefined,
            include: {
                items: {
                    include: { product: true }
                },
                user: {
                    select: { name: true, email: true }
                }
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findById(id: string) {
        return prisma.quote.findUnique({
            where: { id },
            include: {
                items: {
                    include: { product: true }
                },
                user: {
                    select: { name: true, email: true }
                }
            },
        });
    }

    async create(data: { userId: string, notes?: string, items: { productId: string, quantity: number, unitPrice: number }[] }) {
        const total = data.items.reduce(
            (sum, item) => sum + item.quantity * item.unitPrice,
            0,
        );

        return prisma.quote.create({
            data: {
                userId: data.userId,
                notes: data.notes,
                total: new Prisma.Decimal(total),
                items: {
                    create: data.items.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        unitPrice: new Prisma.Decimal(item.unitPrice),
                        subtotal: new Prisma.Decimal(item.quantity * item.unitPrice),
                    })),
                },
            },
            include: { items: true },
        });
    }

    async updateStatus(id: string, status: QuoteStatus) {
        return prisma.quote.update({
            where: { id },
            data: { status },
            include: { items: true },
        });
    }
}

export const quoteService = new QuoteService();
