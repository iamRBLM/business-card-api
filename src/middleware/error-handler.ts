import { type ErrorRequestHandler } from "express";
import { MongoServerError } from "mongodb";
import { ZodError } from "zod";
import env from "../config/index.ts";

/**
 * List of token error names from the JOSE library.
 */
const validationErrorNames = [
  "JOSEError",
  "JWKInvalid",
  "JWEInvalid",
  "JWSInvalid",
  "JWTExpired",
  "JWTInvalid",
  "JWSSignatureVerificationFailed",
];

/**
 * Centralized error handling middleware for the application.
 */
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // Bind error to response for pino-http
  res.err = err;

  // 1. Handle token/JWT errors -> 401 Unauthorized
  if (err.name && validationErrorNames.includes(err.name)) {
    req.log?.warn({ err }, "[errorHandler]: Unauthorized token error");
    return res.status(401).json({
      error: "Unauthorized",
      message: err.message || "Invalid or expired token",
    });
  }

  // 2. Handle malformed JSON body errors -> 400 Bad Request
  if (err instanceof SyntaxError && "body" in err) {
    req.log?.warn({ err }, "[errorHandler]: Malformed JSON payload");
    return res.status(400).json({
      error: err.name,
      message: "Invalid JSON Format",
      description: err.message,
    });
  }

  // 3. Handle Zod validation errors -> 400 Bad Request
  if (err instanceof ZodError) {
    req.log?.warn(
      { issues: err.issues },
      "[errorHandler]: Zod validation failure",
    );
    return res.status(400).json({
      message: "Validation Error",
      issues: err.issues,
    });
  }

  // 4. Handle MongoDB database errors -> 400 Bad Request
  if (err instanceof MongoServerError) {
    req.log?.warn(
      { code: err.code, keyValue: err.keyValue },
      "[errorHandler]: Database constraint violation",
    );
    return res.status(400).json({
      message: err.errmsg || "Database constraint violation",
      code: err.errorResponse?.code ?? err.code ?? "no-code",
      name: err.name,
      keyValue: err.keyValue,
      stack: env.LOG_LEVEL === "debug" ? err.stack : undefined,
    });
  }

  // 5. Handle all other errors with appropriate status codes
  const status =
    err.statusCode ||
    err.status ||
    (res.statusCode >= 400 ? res.statusCode : 500);

  // Log 500 errors as server errors and 4xx errors as warnings
  if (status >= 500) {
    req.log?.error(err, "[errorHandler]: Unhandled Server Error");
  } else {
    req.log?.warn(
      { status, message: err.message },
      "[errorHandler]: Client request error",
    );
  }

  return res.status(status).json({
    message: err.message || "Internal server error",
  });
};

export { errorHandler };
