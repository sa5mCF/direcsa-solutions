import { prisma } from '@/src/lib/prisma';
import { Prisma } from '@prisma/client';

export class ContactService {
    async create(data: Prisma.ContactMessageCreateInput) {
        return prisma.contactMessage.create({
            data,
        });
    }

    async findAll() {
        return prisma.contactMessage.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    async update(id: string, data: Prisma.ContactMessageUncheckedUpdateInput) {
        return prisma.contactMessage.update({
            where: { id },
            data,
        });
    }
}

export const contactService = new ContactService();
