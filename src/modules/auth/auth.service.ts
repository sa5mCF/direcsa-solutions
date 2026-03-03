import { prisma } from '@/src/lib/prisma';
import { hashPassword, verifyPassword } from '@/src/lib/auth/password';
import { signToken } from '@/src/lib/auth/jwt';
import { Prisma, UserType } from '@prisma/client';

export class AuthService {
    async register(data: { name: string; email: string; password: string }) {
        const { name, email, password } = data;

        // Check if user exists
        const existing = await prisma.user.findUnique({
            where: { email: email.toLowerCase().trim() },
        });

        if (existing) {
            throw new Error('Ya existe una cuenta con ese email');
        }

        const hashed = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                name: name.trim(),
                email: email.toLowerCase().trim(),
                passwordHash: hashed,
                userType: UserType.BUYER,
            },
        });

        return { user };
    }

    async login(data: { email: string; password: string }) {
        const { email, password } = data;

        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase().trim() },
        });

        if (!user) {
            throw new Error('Credenciales inválidas');
        }

        const isValid = await verifyPassword(password, user.passwordHash);
        if (!isValid) {
            throw new Error('Credenciales inválidas');
        }

        const token = await signToken({
            sub: user.id,
            email: user.email,
            role: user.userType,
        });

        return { user, token };
    }

    async findById(id: string) {
        return prisma.user.findUnique({ where: { id } });
    }
}

export const authService = new AuthService();
