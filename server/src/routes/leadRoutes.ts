import { Router } from 'express';
import {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
} from '../controllers/leadController';
import {
  createLeadValidation,
  updateLeadValidation,
  idParamValidation,
} from '../validators/leadValidators';
import authMiddleware from '../middleware/authMiddleware';

/**
 * Lead Routes — ALL routes are protected (require JWT).
 *
 * The authMiddleware is applied to the ENTIRE router using router.use().
 * This means every route below automatically requires authentication.
 * No need to add authMiddleware to each individual route.
 *
 * ROUTE → MIDDLEWARE → CONTROLLER FLOW:
 *
 * POST   /api/leads      → auth → validate body → createLead
 * GET    /api/leads       → auth → getLeads (with query params)
 * GET    /api/leads/:id   → auth → validate :id  → getLeadById
 * PUT    /api/leads/:id   → auth → validate :id + body → updateLead
 * DELETE /api/leads/:id   → auth → validate :id  → deleteLead
 */

const router = Router();

// Apply auth middleware to ALL lead routes
router.use(authMiddleware);

// Lead CRUD routes
router.post('/', createLeadValidation, createLead);
router.get('/', getLeads);
router.get('/:id', idParamValidation, getLeadById);
router.put('/:id', [...idParamValidation, ...updateLeadValidation], updateLead);
router.delete('/:id', idParamValidation, deleteLead);

export default router;
