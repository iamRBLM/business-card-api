import { type ErrorRequestHandler } from "express";
import { MongoServerError } from "mongodb";
import { ZodError } from "zod";
import env from "../config/index.ts";
import { logErrorToFile } from "../utils/file-logger.ts";

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
    const status = 401;
    const message = err.message || "Invalid or expired token";

    logErrorToFile(req.method, req.originalUrl || req.url, status, message);
    req.log?.warn({ err }, "[errorHandler]: Unauthorized token error");

    return res.status(status).json({
      error: "Unauthorized",
      message,
    });
  }

  // 2. Handle malformed JSON body errors -> 400 Bad Request
  if (err instanceof SyntaxError && "body" in err) {
    const status = 400;
    const message = "Invalid JSON Format";

    logErrorToFile(req.method, req.originalUrl || req.url, status, message);
    req.log?.warn({ err }, "[errorHandler]: Malformed JSON payload");

    return res.status(status).json({
      error: err.name,
      message,
      description: err.message,
    });
  }

  // 3. Handle Zod validation errors -> 400 Bad Request
  if (err instanceof ZodError) {
    const status = 400;
    const message = "Validation Error";

    logErrorToFile(req.method, req.originalUrl || req.url, status, message);
    req.log?.warn(
      { issues: err.issues },
      "[errorHandler]: Zod validation failure",
    );

    return res.status(status).json({
      message,
      issues: err.issues,
    });
  }

  // 4. Handle MongoDB database errors -> 400 Bad Request
  if (err instanceof MongoServerError) {
    const status = 400;
    const message = err.errmsg || "Database constraint violation";

    logErrorToFile(req.method, req.originalUrl || req.url, status, message);
    req.log?.warn(
      { code: err.code, keyValue: err.keyValue },
      "[errorHandler]: Database constraint violation",
    );

    return res.status(status).json({
      message,
      code: err.errorResponse?.code ?? err.code ?? "no-code",
      name: err.name,
      keyValue: err.keyValue,
      stack: env.LOG_LEVEL === "debug" ? err.stack : undefined,
    });
  }

  // 5. Handle all other errors with appropriate status codes (including NotFoundError / 500)
  const status =
    err.statusCode ||
    err.status ||
    (res.statusCode >= 400 ? res.statusCode : 500);

  const message = err.message || "Internal server error";

  // Always log errors with status >= 400
  if (status >= 400) {
    logErrorToFile(req.method, req.originalUrl || req.url, status, message);
  }

  // Log 500 errors as server errors and 4xx errors as warnings
  if (status >= 500) {
    req.log?.error(err, "[errorHandler]: Unhandled Server Error");
  } else {
    req.log?.warn({ status, message }, "[errorHandler]: Client request error");
  }

  return res.status(status).json({
    message,
  });
};

export { errorHandler };
