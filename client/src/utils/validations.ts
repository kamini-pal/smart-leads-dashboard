import { z } from 'zod';

/**
 * Zod Validation Schemas for auth forms.
 *
 * WHY Zod instead of manual validation?
 * ┌──────────────────────────────────────────────────────────┐
 * │ Manual:  if (!email) setError("Email required")          │
 * │          if (!email.includes("@")) setError("Invalid")   │
 * │          ... 20 lines of if/else for each field          │
 * │                                                          │
 * │ Zod:     z.string().email("Invalid email")               │
 * │          One line. Type-safe. Reusable.                   │
 * └──────────────────────────────────────────────────────────┘
 *
 * HOW IT WORKS WITH REACT HOOK FORM:
 * 1. Define schema with Zod
 * 2. Connect to form via zodResolver(schema)
 * 3. React Hook Form validates automatically on submit
 * 4. Errors appear next to the fields instantly
 */

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
  role: z
    .enum(['admin', 'sales'], {
      error: 'Please select a role',
    }),
});

/**
 * Infer TypeScript types from Zod schemas.
 * This way, the form data type is automatically derived
 * from the schema — no need to maintain types separately.
 */
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
