import jwt, { SignOptions } from 'jsonwebtoken';
import env from '../config/env';
import { AuthPayload } from '../types';

/**
 * Generates a JWT (JSON Web Token).
 *
 * HOW JWT WORKS (beginner explanation):
 * ┌──────────────────────────────────────────────────┐
 * │ JWT = Header.Payload.Signature                   │
 * │                                                  │
 * │ Header:    Algorithm used (HS256)                 │
 * │ Payload:   Data we encode (userId, role)          │
 * │ Signature: Header + Payload + SECRET_KEY          │
 * │            (this proves the token wasn't tampered) │
 * └──────────────────────────────────────────────────┘
 *
 * Think of it like a sealed envelope:
 * - Anyone can READ the contents (payload is just base64)
 * - But only our server can VERIFY the seal (using JWT_SECRET)
 * - If someone changes the payload, the seal breaks
 *
 * WHY JWT_SECRET is critical:
 * If someone knows your secret, they can forge tokens and
 * pretend to be any user. NEVER commit it to Git.
 */
const generateToken = (payload: AuthPayload): string => {
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
  };

  return jwt.sign(
    { userId: payload.userId, role: payload.role },
    env.JWT_SECRET,
    options
  );
};

export default generateToken;

