import { body } from 'express-validator';
import { UserRole } from '../types';

/**
 * Validation rules for auth routes.
 *
 * WHY validate on the backend?
 * - Frontend validation can be bypassed (someone can call your API directly)
 * - Backend is the LAST line of defense — never trust user input
 * - express-validator checks rules and collects errors BEFORE the controller runs
 *
 * HOW IT WORKS:
 * These are middleware arrays. Express runs them in order before the controller.
 * If validation fails, we catch errors in the controller using validationResult().
 */

export const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),

  body('role')
    .optional()
    .isIn(Object.values(UserRole))
    .withMessage(`Role must be one of: ${Object.values(UserRole).join(', ')}`),
];

export const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];
