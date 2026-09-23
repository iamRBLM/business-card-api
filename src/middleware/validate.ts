import { type RequestHandler } from "express";
import { ZodType } from "zod/v4";
import { userSchema } from "../validations/user.ts";
import { loginSchema } from "../validations/login.ts";
import { cardSchema } from "../validations/card.ts";
import { updateBizNumberSchema } from "../validations/bizNumber.ts";

/**
 * Generic middleware function to validate incoming request body data using a Zod schema.
 * It parses and cleans the data, replaces req.body with the valid result, and moves to the next step.
 */
export function validateSchema<T>(
  schema: ZodType<T>,
): RequestHandler<any, any, T> {
  return async (req, res, next) => {
    req.body = await schema.parseAsync(req.body);
    next();
  };
}

/**
 * Middleware to validate new user registration data.
 */
export const validateUser = validateSchema(userSchema);

/**
 * Middleware to validate user login credentials.
 */
export const validateLogin = validateSchema(loginSchema);

/**
 * Middleware to validate partial user updates (allows updating only specific fields).
 */
export const validateUserUpdate = validateSchema(userSchema.partial());

/**
 * Middleware to validate partial business card updates.
 */
export const validateCardUpdate = validateSchema(cardSchema.partial());

/**
 * Middleware to validate new business card creation data.
 */
export const validateCard = validateSchema(cardSchema);

/**
 * Middleware to validate business number updates (Admin only).
 */
export const validateBizNumber = validateSchema(updateBizNumberSchema);
