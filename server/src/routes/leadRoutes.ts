import { Router } from 'express';
import {
  createLead,
  getLeads,
  getLeadStats,
  getLeadById,
  updateLead,
  deleteLead,
  exportLeadsCsv,
} from '../controllers/leadController';
import {
  createLeadValidation,
  updateLeadValidation,
  idParamValidation,
} from '../validators/leadValidators';
import authMiddleware from '../middleware/authMiddleware';
import authorizeRoles from '../middleware/roleMiddleware';
import { UserRole } from '../types';

/**
 * Lead Routes — ALL routes are protected (require JWT + role check).
 *
 * MIDDLEWARE EXECUTION ORDER for each request:
 * ┌──────────────────────────────────────────────────────────┐
 * │ 1. authMiddleware     → "Is the user logged in?"        │
 * │ 2. authorizeRoles()   → "Does the user have permission?"│
 * │ 3. validation         → "Is the request data valid?"    │
 * │ 4. controller         → "Execute the business logic"    │
 * └──────────────────────────────────────────────────────────┘
 *
 * RBAC RULES:
 * ┌─────────────────┬───────────┬────────────┐
 * │ Action          │ Admin     │ Sales      │
 * ├─────────────────┼───────────┼────────────┤
 * │ Create Lead     │ ✅        │ ✅         │
 * │ View Leads      │ ✅        │ ✅         │
 * │ Update Lead     │ ✅        │ ✅         │
 * │ Delete Lead     │ ✅        │ ❌         │
 * │ Export CSV      │ ✅        │ ✅         │
 * └─────────────────┴───────────┴────────────┘
 */

const router = Router();

// Apply auth middleware to ALL lead routes
router.use(authMiddleware);

// CSV export — MUST be before /:id routes (otherwise "export" gets treated as an :id)
router.get(
  '/export/csv',
  authorizeRoles(UserRole.ADMIN, UserRole.SALES),
  exportLeadsCsv
);

// Lead CRUD routes
router.post(
  '/',
  authorizeRoles(UserRole.ADMIN, UserRole.SALES),
  createLeadValidation,
  createLead
);

router.get(
  '/',
  authorizeRoles(UserRole.ADMIN, UserRole.SALES),
  getLeads
);

router.get(
  '/stats',
  authorizeRoles(UserRole.ADMIN, UserRole.SALES),
  getLeadStats
);

router.get(
  '/:id',
  authorizeRoles(UserRole.ADMIN, UserRole.SALES),
  idParamValidation,
  getLeadById
);

router.put(
  '/:id',
  authorizeRoles(UserRole.ADMIN, UserRole.SALES),
  [...idParamValidation, ...updateLeadValidation],
  updateLead
);

// DELETE — Admin only!
router.delete(
  '/:id',
  authorizeRoles(UserRole.ADMIN),  // ← Only admins can delete
  idParamValidation,
  deleteLead
);

export default router;
