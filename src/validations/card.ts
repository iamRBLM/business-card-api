import { z } from "zod/v4";
import { addressSchema } from "./address.ts";
import { imageSchema } from "./image.ts";
import { phoneRegex } from "./patterns.ts";

/**
 * Validation schema for business card data.
 * Checks rules for title, subtitle, description, phone, email, website URL, address, and an optional image.
 */
export const cardSchema = z.object({
  title: z.string().min(2).max(100),
  subtitle: z.string().min(2).max(100),
  description: z.string().min(2).max(500),
  phone: z.string().min(9).max(15).regex(phoneRegex),
  email: z.email().min(5).max(255),
  web: z.url().min(5).max(255),
  address: addressSchema,
  image: imageSchema.optional(),
});

/**
 * TypeScript type inferred from the business card schema.
 */
export type Card = z.infer<typeof cardSchema>;
