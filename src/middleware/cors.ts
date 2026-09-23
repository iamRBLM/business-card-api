import corsMiddleware, { type CorsOptions } from "cors";
import { HttpError } from "../error/custom-error.ts";
import env from "../config/index.ts";

/**
 * Whitelist Registry:
 * Central array containing trusted origins, driven by environment config.
 */
const allowedOrigins = [
  env.CLIENT_URL,
  "http://localhost:5173", // Vite default
  "http://localhost:3000", // CRA / Next default
].filter(Boolean) as string[];

/**
 * Granular CORS Security Policy
 */
const corsOptions: CorsOptions = {
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
  ],
  credentials: true,
  origin: (origin, callback) => {
    // Allows server-to-server, Postman, or whitelisted client domains
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new HttpError("Blocked by CORS policy", 403));
    }
  },
};

export const cors = corsMiddleware(corsOptions);
