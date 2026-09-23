/**
 * Add the authenticated user to the Express Request type.
 */

import { DBUser } from "../database/schemas/user.ts";
import { type Request } from "express";

declare global {
  namespace Express {
    interface Request {
      /**
       * The logged-in user retrieved from the database.
       * Optional because public routes do not set this.
       */
      user?: DBUser;
    }
  }
}
