import { z } from "zod/v4";
import { addressSchema } from "./address.ts";
import { nameSchema } from "./name.ts";
import { passwordRegex, phoneRegex } from "./patterns.ts";
import { imageSchema } from "./image.ts";

/**
 * Primary User Registration Input Schema (`userSchema`)
 *
 * Strict Object Validation Principles:
 * 1. `z.strictObject()`: Rejects payloads with unrecognised properties.
 * 2. Regex and Sub-Schemas: Integrates password, phone, address, and name validations.
 * 3. Optional defaults: Makes `image` optional to align with database defaults.
 */
export const userSchema = z.strictObject({
  address: addressSchema,
  email: z.email().min(5).max(250),
  name: nameSchema,
  password: z.string().min(7).max(30).regex(passwordRegex),
  phone: z.string().min(9).max(15).regex(phoneRegex),
  image: imageSchema.optional(),
  isBusiness: z.boolean(),
});

/**
 * Static TypeScript Type Inference (`User`)
 */
export type User = z.infer<typeof userSchema>;
