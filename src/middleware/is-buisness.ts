import { type RequestHandler } from "express";
import validateToken from "./validate-token.ts";
import { HttpError } from "../error/custom-error.ts";

/**
 * Middleware to check if the logged-in user is a business user or an admin.
 */
const isBuisnessHandler: RequestHandler = (req, res, next) => {
  if (!req.user) {
    return next(new HttpError("Unauthorized", 401));
  }

  const isBusinessOrAdmin = req.user.isBusiness || req.user.isAdmin;

  if (isBusinessOrAdmin) {
    return next();
  }

  next(new HttpError("Must be a business user or admin", 403));
};

/**
 * Combined middleware array: validates the token first, then checks if the user is a business user or admin.
 */
export const isBuisness = [validateToken, isBuisnessHandler];
