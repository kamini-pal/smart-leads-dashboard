import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import User from '../models/User';
import generateToken from '../utils/generateToken';
import { ApiError, AuthResponse } from '../types';

/**
 * Auth Controller — handles Register, Login, and GetMe.
 *
 * CONTROLLER RULES (keep these clean!):
 * 1. Parse the request (req.body, req.params)
 * 2. Call the business logic (database queries, etc.)
 * 3. Send the response
 *
 * Controllers should NOT contain complex logic — that goes in services/.
 * For auth, the logic is simple enough to stay in the controller.
 */

// ────────────────────────────────────────────────────────────
// POST /api/auth/register
// ────────────────────────────────────────────────────────────
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Step 1: Check for validation errors (from authValidators middleware)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
      return;
    }

    const { name, email, password, role } = req.body;

    // Step 2: Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(409, 'User with this email already exists');
    }

    // Step 3: Create user (password gets hashed automatically by pre-save hook)
    const user = await User.create({ name, email, password, role });

    // Step 4: Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      role: user.role,
    });

    // Step 5: Send response (NEVER include password!)
    const response: AuthResponse = {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: response,
    });
  } catch (error) {
    next(error); // Passes error to centralized errorHandler
  }
};

// ────────────────────────────────────────────────────────────
// POST /api/auth/login
// ────────────────────────────────────────────────────────────
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Step 1: Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
      return;
    }

    const { email, password } = req.body;

    // Step 2: Find user AND include password (select: false in schema, so we need +password)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      // SECURITY: Use vague message — don't reveal if email exists or not
      throw new ApiError(401, 'Invalid email or password');
    }

    // Step 3: Compare passwords
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // Step 4: Generate token
    const token = generateToken({
      userId: user._id.toString(),
      role: user.role,
    });

    // Step 5: Send response
    const response: AuthResponse = {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

// ────────────────────────────────────────────────────────────
// GET /api/auth/me (Protected — requires valid JWT)
// ────────────────────────────────────────────────────────────
export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // req.user is set by authMiddleware (contains userId and role from JWT)
    const user = await User.findById(req.user?.userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    res.status(200).json({
      success: true,
      message: 'User profile fetched successfully',
      data: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};
