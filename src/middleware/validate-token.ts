import { type RequestHandler, type Request } from "express";
import { HttpError } from "../error/custom-error.ts";
import authService from "../services/auth-service.ts";
import { UserModel } from "../database/models.ts";
import { logger } from "./logger.ts";

/**
 * Extract the JWT string from the Authorization header.
 */
const extractToken = (req: Request): string => {
  const authToken = req.header("Authorization");

  if (
    authToken &&
    authToken.length > 7 &&
    authToken.toLowerCase().startsWith("bearer ")
  ) {
    return authToken.substring(7);
  }

  logger.warn("[extractToken]: Authorization header is missing or malformed");
  throw new HttpError("Authorization header is missing or malformed", 401);
};

/**
 * Middleware to validate the JWT token, find the user in the database, and attach them to the request.
 */
const validateToken: RequestHandler = async (req, res, next) => {
  // 1. Extract the token
  const token = extractToken(req);

  // 2. Verify token and get the user ID from the payload
  const payload = await authService.verifyJWT(token);
  const userId = (payload as any)?._id;

  if (!userId) {
    logger.warn("[validateToken]: Invalid token payload - missing _id");
    throw new HttpError("Invalid token payload", 401);
  }

  // 3. Find the user by ID in the database
  const user = await UserModel.findById(userId).select("-password");
  if (!user) {
    logger.warn({ userId }, "[validateToken]: User does not exist");
    throw new HttpError("User does not exist", 401);
  }

  // 4. Attach user to req.user and proceed to the next step
  req.user = user;
  next();
};

export default validateToken;
