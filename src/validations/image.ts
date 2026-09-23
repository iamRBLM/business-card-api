import { z } from "zod/v4";

/**
 * Validation schema for image objects (alt text and URL).
 * Alt text is optional and defaults to an empty string. URL must be valid and between 5 and 250 characters.
 */
export const imageSchema = z.object({
  alt: z.string().max(100).nullish().default(""),
  url: z.url().min(5).max(250),
});

/**
 * TypeScript type inferred from the image schema.
 */
export type Image = z.infer<typeof imageSchema>;