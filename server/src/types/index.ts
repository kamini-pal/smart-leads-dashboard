/**
 * Custom API Error class.
 *
 * WHY: Express's default errors don't have a statusCode.
 * By extending Error, we can throw errors with HTTP status codes
 * and catch them in our centralized error middleware.
 *
 * USAGE:
 *   throw new ApiError(404, 'Lead not found');
 *   throw new ApiError(400, 'Invalid email format');
 */
export class ApiError extends Error {
  public statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;

    // This fixes the prototype chain (needed for instanceof to work properly)
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/**
 * Standard API response shape.
 *
 * WHY: Consistent response format makes the frontend's job easier.
 * The frontend always knows to check response.success, then access
 * response.data or response.message accordingly.
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

/**
 * Paginated API response.
 *
 * WHY: When returning lists (leads), the frontend needs to know
 * total count, current page, etc. for pagination UI.
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}
