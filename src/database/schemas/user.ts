import { Schema, Document, Model, Types } from "mongoose";
import { type User } from "../../validations/user.ts";
import { nameDBSchema } from "./name.ts";
import { addressDBSchema } from "./address.ts";
import { imageDBSchema } from "./image.ts";

/**
 * Type representing a user document stored in the database.
 */
export type DBUser = User & {
  isAdmin?: boolean;
  createdAt?: Date;
  _id: Types.ObjectId;
};

/**
 * Interface for a Mongoose user document instance.
 */
export interface IUserDocument extends DBUser, Document {
  setPassword(password: string): Promise<this>;
}

/**
 * Interface for the Mongoose user model (includes static methods).
 */
export interface IUserModel extends Model<IUserDocument> {
  findByEmail(email: string): Promise<IUserDocument | null>;
}

/**
 * Mongoose schema definition for the User collection.
 */
export const userDBSchema = new Schema<DBUser, IUserModel>({
  name: { type: nameDBSchema, required: true },
  address: { type: addressDBSchema, required: true },
  image: {
    type: imageDBSchema,
    required: false,
    default: {
      alt: "user-profile",
      url: "https://picsum.photos/200/300",
    },
  },
  phone: {
    type: String,
    minlength: 9,
    maxlength: 15,
    required: true,
  },
  email: {
    type: String,
    minlength: 5,
    maxlength: 50,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    minlength: 7,
    select: false,
    maxlength: 255,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: false,
    default: false,
  },
  isBusiness: {
    type: Boolean,
    required: true,
  },
  createdAt: {
    type: Date,
    required: false,
    default: Date.now,
  },
});