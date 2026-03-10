import { prisma } from '@/src/lib/prisma';
import { UserType, PermissionType } from '@prisma/client';
import { hashPassword } from '@/src/lib/auth/password';

export class AdminService {
    async getAdmins() {
        return prisma.user.findMany({
            where: { userType: UserType.ADMIN },
            select: {
                id: true,
                name: true,
                email: true,
                isActive: true,
                createdAt: true,
                user_permissions: {
                    include: {
                        permission: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async createAdmin(data: { name: string; email: string; password: string }) {
        const { name, email, password } = data;

        const existing = await prisma.user.findUnique({
            where: { email: email.toLowerCase().trim() }
        });

        if (existing) {
            throw new Error('Ya existe un usuario con este correo');
        }

        const passwordHash = await hashPassword(password);

        return prisma.user.create({
            data: {
                name: name.trim(),
                email: email.toLowerCase().trim(),
                passwordHash,
                userType: UserType.ADMIN,
                isActive: true
            }
        });
    }

    async hasPermission(userId: string, permissionType: PermissionType): Promise<boolean> {
        const permission = await prisma.userPermission.findFirst({
            where: {
                userId,
                permission: {
                    type: permissionType
                },
                isActive: true
            }
        });

        return !!permission;
    }

    async getUserPermissions(userId: string) {
        const permissions = await prisma.userPermission.findMany({
            where: { userId, isActive: true },
            include: {
                permission: true
            }
        });

        return permissions.map(p => p.permission.type);
    }
}

export const adminService = new AdminService();
