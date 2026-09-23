import { type RequestHandler } from "express";
import validateToken from "./validate-token.ts";
import { HttpError } from "../error/custom-error.ts";

/**
 * Middleware to check if the logged-in user is an admin or the owner of the requested resource.
 */
const isOwnerOrAdminHandler: RequestHandler = (req, res, next) => {
  // 1. Allow access if the user is an admin
  const isAdmin = req.user?.isAdmin;
  if (isAdmin) {
    return next();
  }

  // 2. Allow access if the user's ID matches the ID in the URL parameter
  if (req.user?._id.toString() === req.params.id) {
    return next();
  }

  // 3. Block access if the user is neither admin nor the owner
  next(new HttpError("Must be admin or owner", 403));
};

/**
 * Combined middleware array: validates the token first, then checks if the user is an admin or owner.
 */
export const isOwnerOrAdmin = [validateToken, isOwnerOrAdminHandler];
