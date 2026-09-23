import { type RequestHandler } from "express";
import { NotFoundError } from "../error/custom-error.ts";

/**
 * Middleware to handle routes that do not exist (404 error) and pass them to the error handler.
 */
const notFound: RequestHandler = (req, res, next) => {
  next(
    new NotFoundError(`Resource not found: ${req.method} ${req.originalUrl}`),
  );
};

export default notFound;
