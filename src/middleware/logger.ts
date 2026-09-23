import pino from "pino";
import { pinoHttp } from "pino-http";
import env from "../config/index.ts";

/**
 * Main application logger instance using Pino.
 */
export const logger = pino({
  level: process.env?.LOG_LEVEL ?? "info",
});

/**
 * HTTP request logging middleware for tracking incoming and outgoing traffic.
 */
export const httpLogger = pinoHttp({
  logger,
  customLogLevel(req, res, error) {
    if (error || res.statusCode >= 500) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },
});
