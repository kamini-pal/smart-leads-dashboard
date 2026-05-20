import { body, param } from 'express-validator';
import { LeadStatus, LeadSource } from '../types';

/**
 * Validation rules for lead routes.
 *
 * WHY separate validation from controller?
 * - Controller stays clean (only business logic)
 * - Validation rules are reusable
 * - Bad data is rejected BEFORE hitting the database
 */

// Shared field validators (used by both create and update)
const nameValidator = body('name')
  .trim()
  .notEmpty()
  .withMessage('Lead name is required')
  .isLength({ min: 2, max: 100 })
  .withMessage('Name must be between 2 and 100 characters');

const emailValidator = body('email')
  .trim()
  .notEmpty()
  .withMessage('Lead email is required')
  .isEmail()
  .withMessage('Please provide a valid email')
  .normalizeEmail();

const statusValidator = body('status')
  .optional()
  .isIn(Object.values(LeadStatus))
  .withMessage(`Status must be one of: ${Object.values(LeadStatus).join(', ')}`);

const sourceValidator = body('source')
  .notEmpty()
  .withMessage('Lead source is required')
  .isIn(Object.values(LeadSource))
  .withMessage(`Source must be one of: ${Object.values(LeadSource).join(', ')}`);

// ── Create Lead validation ──
export const createLeadValidation = [
  nameValidator,
  emailValidator,
  statusValidator,
  sourceValidator,
];

// ── Update Lead validation (all fields optional) ──
export const updateLeadValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),

  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),

  statusValidator,

  body('source')
    .optional()
    .isIn(Object.values(LeadSource))
    .withMessage(`Source must be one of: ${Object.values(LeadSource).join(', ')}`),
];

// ── Validate MongoDB ObjectId in URL params ──
export const idParamValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid lead ID format'),
];
