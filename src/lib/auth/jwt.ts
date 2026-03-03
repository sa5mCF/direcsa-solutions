import { jwtVerify, SignJWT } from 'jose';

const JWT_EXPIRES_IN = '7d';

export interface JwtPayload {
    sub: string;
    email: string;
    role: string;
    iat?: number;
    exp?: number;
}

function getJwtSecret() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET no está configurado');
    }
    return new TextEncoder().encode(secret);
}

export async function signToken(payload: Record<string, unknown>): Promise<string> {
    const secret = getJwtSecret();
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(JWT_EXPIRES_IN)
        .sign(secret);
}

export async function verifyToken(token: string): Promise<JwtPayload> {
    const secret = getJwtSecret();
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as JwtPayload;
}
