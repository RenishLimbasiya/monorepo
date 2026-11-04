import 'dotenv/config';
import { SignJWT, jwtVerify } from 'jose';
import { AppError } from '../../shared/errors/app.error.js';
import type { AuthenticatedUser } from '../../shared/types/express.js';

const issuer = 'taskflow-api';
const audience = 'taskflow-client';
const tokenLifetime = '15m';
export const accessTokenLifetimeSeconds = 15 * 60;

const secret = process.env.JWT_ACCESS_TOKEN_SECRET;
if (!secret || Buffer.byteLength(secret, 'utf8') < 32) {
  throw new Error('JWT_ACCESS_TOKEN_SECRET must be set to a random value of at least 32 bytes.');
}

const key = new TextEncoder().encode(secret);

export const signAccessToken = async (user: Pick<AuthenticatedUser, 'userId' | 'email'>) =>
  new SignJWT({ email: user.email, tokenUse: 'access' })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setSubject(user.userId)
    .setIssuer(issuer)
    .setAudience(audience)
    .setIssuedAt()
    .setExpirationTime(tokenLifetime)
    .sign(key);

export const verifyAccessToken = async (token: string): Promise<AuthenticatedUser> => {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ['HS256'],
      issuer,
      audience,
    });

    if (
      typeof payload.sub !== 'string' ||
      typeof payload.email !== 'string' ||
      payload.tokenUse !== 'access'
    ) {
      throw new Error('Required access-token claims are missing.');
    }

    return { userId: payload.sub, email: payload.email };
  } catch {
    throw new AppError(401, 'INVALID_ACCESS_TOKEN', 'The access token is invalid or expired.');
  }
};
