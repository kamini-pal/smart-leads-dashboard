import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../types';

/**
 * Centralized error handling middleware.
 *
 * HOW IT WORKS:
 * When any route/controller calls next(error) or throws an error,
 * Express skips all remaining middleware and jumps directly here.
 *
 * WHY centralized:
 * - Every error goes through ONE place — consistent error responses
 * - No need to write try/catch with res.status().json() in every controller
 * - Easy to add logging, monitoring, etc. later
 *
 * BEGINNER TIP:
 * Express knows this is an error handler because it has 4 parameters.
 * Regular middleware has 3 (req, res, next). The extra `err` parameter
 * tells Express "this handles errors."
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction): void => {
  // If it's our custom ApiError, use its status code
  // Otherwise, default to 500 (Internal Server Error)
  const statusCode = err instanceof ApiError ? err.statusCode : 500;

  const message = err.message || 'Internal Server Error';

  // Log the error for debugging (only full stack in development)
  console.error(`❌ [${req.method}] ${req.path} → ${statusCode}: ${message}`);
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message,
    // Only show stack trace in development (never in production — security risk)
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;
