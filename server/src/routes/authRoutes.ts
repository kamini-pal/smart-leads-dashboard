import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController';
import { registerValidation, loginValidation } from '../validators/authValidators';
import authMiddleware from '../middleware/authMiddleware';

/**
 * Auth Routes — maps URLs to controller functions.
 *
 * REQUEST FLOW for POST /api/auth/register:
 * ┌──────────────────────────────────────────────────────────┐
 * │ 1. Request hits Express                                  │
 * │ 2. Global middleware runs (helmet, cors, json parser)    │
 * │ 3. Route matches POST /api/auth/register                │
 * │ 4. registerValidation middleware runs (validates body)   │
 * │ 5. register controller runs (creates user, returns JWT)  │
 * │ 6. If error → errorHandler middleware catches it         │
 * └──────────────────────────────────────────────────────────┘
 *
 * REQUEST FLOW for GET /api/auth/me (protected):
 * ┌──────────────────────────────────────────────────────────┐
 * │ Same as above, but between route match and controller:   │
 * │ → authMiddleware runs (verifies JWT, sets req.user)     │
 * │ → If no valid token → 401 Unauthorized                  │
 * │ → If valid token → controller runs with req.user set    │
 * └──────────────────────────────────────────────────────────┘
 */

const router = Router();

// Public routes (no auth required)
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

// Protected route (auth required — must send JWT in Authorization header)
router.get('/me', authMiddleware, getMe);

export default router;
