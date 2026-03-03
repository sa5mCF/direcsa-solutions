import { Prisma } from "@prisma/client";

export type AuthUser = Omit<Prisma.UserGetPayload<{}>, 'passwordHash' | 'userType'> & {
    role: string;
};

export function toAuthUser(user: Prisma.UserGetPayload<{}>): AuthUser {
    const { passwordHash, userType, ...rest } = user;
    return {
        ...rest,
        role: userType,
    };
}
