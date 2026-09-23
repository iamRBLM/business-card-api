import bcrypt from "bcrypt";
import { SignJWT, type JWTPayload, jwtVerify } from "jose";
import env from "../config/index.ts";

/**
 * Service for authentication, password hashing, and JWT creation/verification.
 */
const authService = {
  /**
   * Hash a plain-text password using bcrypt.
   */
  hashPassword: (plainPassword: string, rounds: number = 12) => {
    return bcrypt.hash(plainPassword, rounds);
  },

  /**
   * Compare a plain-text password with a stored hash.
   */
  validatePassword: (plainPassword: string, hashed: string) => {
    return bcrypt.compare(plainPassword, hashed);
  },

  /**
   * Generate a signed JWT token that expires in 2 hours.
   */
  generateJWT: async (payload: JWTPayload) => {
    return new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("2h")
      .setIssuedAt()
      .sign(new TextEncoder().encode(env.JWT_SECRET));
  },

  /**
   * Verify an incoming JWT token and return its payload.
   */
  verifyJWT: async (token: string) => {
    const secretKeyInput = new TextEncoder().encode(env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secretKeyInput);
    return payload;
  },
};

export default authService;
