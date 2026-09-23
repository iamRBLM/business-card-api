import { z } from "zod/v4";

/**
 * Validation schema for updating a card's business number.
 * Ensures bizNumber is an integer between 1,000,000 and 9,999,999.
 */
export const updateBizNumberSchema = z.object({
  bizNumber: z.number().int().min(1_000_000).max(9_999_999),
});

/**
 * TypeScript type inferred from the business number schema.
 */
export type UpdateBizNumberInput = z.infer<typeof updateBizNumberSchema>;
