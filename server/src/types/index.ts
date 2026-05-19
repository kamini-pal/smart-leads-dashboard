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

// ────────────────────────────────────────────────────────────
// USER & AUTH TYPES
// ────────────────────────────────────────────────────────────

/**
 * User roles for Role-Based Access Control (RBAC).
 *
 * WHY an enum instead of plain strings?
 * - Typos are caught at compile time (UserRole.ADMN would be an error)
 * - Autocomplete in your editor
 * - Single source of truth — if you rename a role, it updates everywhere
 */
export enum UserRole {
  ADMIN = 'admin',
  SALES = 'sales',
}

/**
 * User document interface — represents a User in MongoDB.
 *
 * WHY: Mongoose returns documents, but TypeScript doesn't know what fields
 * they have. This interface tells TypeScript "a User has name, email, etc."
 * so you get autocomplete and type checking.
 */
export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

/**
 * JWT payload — the data stored inside the token.
 *
 * WHY: When we create a JWT, we encode the user's id and role inside it.
 * When we verify the token later, we decode this data to know WHO is
 * making the request and WHAT they're allowed to do.
 */
export interface AuthPayload {
  userId: string;
  role: UserRole;
}

/**
 * Auth response — what Register and Login endpoints return.
 *
 * WHY: The frontend needs the user's info AND the token.
 * We never return the password — that's a security rule.
 */
export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
  token: string;
}
