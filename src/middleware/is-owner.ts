import { type RequestHandler } from "express";
import validateToken from "./validate-token.ts";
import { HttpError } from "../error/custom-error.ts";

/**
 * Middleware to check if the logged-in user is the owner of the account (matches the ID in the URL).
 */
const isOwnerHandler: RequestHandler = (req, res, next) => {
  const user = req.user;

  if (!user) {
    throw new HttpError("Unauthorized", 401);
  }

  if (user._id.toString() !== req.params.id) {
    throw new HttpError("Access forbidden: account owner only", 403);
  }

  next();
};

/**
 * Combined middleware array: validates the token first, then checks if the user is the owner.
 */
export const isOwner = [validateToken, isOwnerHandler];
