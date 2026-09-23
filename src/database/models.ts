import mongoose, { type Model } from "mongoose";
import { type DBUser, type IUserModel, userDBSchema } from "./schemas/user.ts";
import { cardDBSchema, type DBCard } from "./schemas/card.ts";
import authService from "../services/auth-service.ts";
import { logger } from "../middleware/logger.ts";

/**
 * Hash and set the password for the user instance.
 */
userDBSchema.methods.setPassword = async function (password: string) {
  logger.debug(
    { email: this.email },
    "[userSchema.setPassword]: Hashing password for user",
  );
  this.password = await authService.hashPassword(password);
  return this;
};

/**
 * Find a user by their email address.
 */
userDBSchema.statics.findByEmail = async function (email: string) {
  logger.debug({ email }, "[userSchema.findByEmail]: Querying user by email");
  return this.findOne({ email });
};

/**
 * Compile Mongoose models for users and cards.
 */
const UserModel = mongoose.model<DBUser, IUserModel>("User", userDBSchema);
const CardModel = mongoose.model<DBCard>("Card", cardDBSchema);

export { UserModel, CardModel };
