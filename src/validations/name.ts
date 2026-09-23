import { z } from "zod/v4";

/**
 * Validation schema for the name object (first, middle, and last name).
 * First and last names must be between 2 and 20 characters. Middle name is optional and defaults to an empty string.
 */
export const nameSchema = z.object({
  first: z.string().min(2).max(20),
  middle: z.string().max(20).nullish().default(""),
  last: z.string().min(2).max(20),
});

/**
 * TypeScript type inferred from the name schema.
 */
export type Name = z.infer<typeof nameSchema>;
