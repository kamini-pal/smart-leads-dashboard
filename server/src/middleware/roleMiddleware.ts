import { Request, Response, NextFunction } from 'express';
import { ApiError, UserRole } from '../types';

/**
 * Role-based authorization middleware.
 *
 * DIFFERENCE BETWEEN AUTH vs RBAC (beginner explanation):
 * ┌──────────────────────────────────────────────────────────┐
 * │ Authentication (authMiddleware):                         │
 * │   "WHO are you?" → Verifies JWT token → sets req.user   │
 * │                                                         │
 * │ Authorization (roleMiddleware):                          │
 * │   "WHAT are you allowed to do?" → Checks req.user.role  │
 * │                                                         │
 * │ Auth runs FIRST → then Role check runs SECOND.          │
 * │ You can't check roles without knowing who the user is.  │
 * └──────────────────────────────────────────────────────────┘
 *
 * MIDDLEWARE EXECUTION ORDER:
 *   authMiddleware → authorizeRoles('admin') → controller
 *       ↓                    ↓                    ↓
 *   "Is token valid?"   "Is user admin?"    "Run the logic"
 *   (sets req.user)     (checks role)
 *
 * HOW THIS FUNCTION WORKS:
 * It's a "factory function" — a function that RETURNS a middleware.
 * We call authorizeRoles('admin') and it creates a middleware that
 * only allows admins through. This pattern makes it reusable:
 *
 *   authorizeRoles('admin')           → only admins
 *   authorizeRoles('admin', 'sales')  → admins and sales
 */
const authorizeRoles = (...allowedRoles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    // req.user is set by authMiddleware (runs before this)
    if (!req.user) {
      throw new ApiError(401, 'Authentication required');
    }

    // Check if the user's role is in the allowed roles list
    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError(
        403,
        `Access denied. Role '${req.user.role}' is not authorized for this action.`
      );
    }

    // Role is allowed — proceed to the next middleware/controller
    next();
  };
};

export default authorizeRoles;
