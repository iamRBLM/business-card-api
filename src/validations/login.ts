import { z } from "zod/v4";

/**
 * Validation schema for user login data.
 * Checks that the email is valid and trims/lowercase it, and ensures the password is provided.
 */
export const loginSchema = z.strictObject({
  email: z.email().trim().toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

/**
 * TypeScript type inferred from the login schema.
 */
export type LoginInput = z.infer<typeof loginSchema>;
