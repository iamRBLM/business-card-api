import { z } from "zod/v4";

/**
 * Validation schema for address data (city, country, house number, street, zip, and state).
 * City, country, and street must be between 2 and 50 characters. House number must be between 1 and 5000.
 * Zip code must be between 3 and 10 characters. State is optional and defaults to an empty string.
 */
export const addressSchema = z.object({
  city: z.string().min(2).max(50),
  country: z.string().min(2).max(50),
  houseNumber: z.number().min(1).max(5000),
  street: z.string().min(2).max(50),
  zip: z.string().min(3).max(10),
  state: z.string().max(50).nullish().default(""),
});

/**
 * TypeScript type inferred from the address schema.
 */
export type Address = z.infer<typeof addressSchema>;
