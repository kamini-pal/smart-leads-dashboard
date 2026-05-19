import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import env from '../config/env';
import { ApiError, AuthPayload } from '../types';

/**
 * Extend Express's Request type to include our user data.
 *
 * WHY: After verifying the JWT, we attach the decoded user info
 * to the request object. TypeScript doesn't know about this custom
 * property, so we tell it "req can also have a .user field."
 */
declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

/**
 * Auth middleware — protects routes by verifying JWT tokens.
 *
 * HOW PROTECTED ROUTES WORK (beginner explanation):
 * ┌──────────────────────────────────────────────────────────┐
 * │ 1. Client sends request with header:                     │
 * │    Authorization: Bearer eyJhbGciOiJIUzI1NiIs...         │
 * │                                                          │
 * │ 2. This middleware extracts the token                    │
 * │                                                          │
 * │ 3. jwt.verify() checks:                                  │
 * │    - Is the token valid? (not tampered)                  │
 * │    - Is it expired?                                      │
 * │    - Was it signed with OUR secret?                      │
 * │                                                          │
 * │ 4. If valid → decode userId & role, attach to req.user   │
 * │    If invalid → return 401 Unauthorized                  │
 * │                                                          │
 * │ 5. The controller can then use req.user to know WHO is   │
 * │    making the request                                    │
 * └──────────────────────────────────────────────────────────┘
 */
const authMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  // Step 1: Get the Authorization header
  const authHeader = req.headers.authorization;

  // Step 2: Check if header exists and starts with "Bearer "
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'Access denied. No token provided.');
  }

  // Step 3: Extract the token (remove "Bearer " prefix)
  const token = authHeader.split(' ')[1];

  try {
    // Step 4: Verify and decode the token
    const decoded = jwt.verify(token, env.JWT_SECRET) as AuthPayload;

    // Step 5: Attach user data to the request object
    // Now any controller after this middleware can use req.user
    req.user = decoded;

    next();
  } catch {
    throw new ApiError(401, 'Invalid or expired token.');
  }
};

export default authMiddleware;
