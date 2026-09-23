import { type RequestHandler } from "express";
import { HttpError } from "../error/custom-error.ts";
import validateToken from "./validate-token.ts";

/**
 * Middleware to check if the logged-in user is an admin.
 */
const isAdminHandler: RequestHandler = (req, res, next) => {
  if (!req.user) {
    return next(new HttpError("Unauthorized", 401));
  }

  const isAdmin = req.user.isAdmin;

  // Allow access if the user is an admin
  if (isAdmin) {
    return next();
  }

  // Block access if the user is not an admin
  next(new HttpError("Must be admin", 403));
};

/**
 * Combined middleware array: validates the token first, then checks if the user is an admin.
 */
export const isAdmin = [validateToken, isAdminHandler];
