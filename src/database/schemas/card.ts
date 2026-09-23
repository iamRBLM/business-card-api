import { Schema, Types } from "mongoose";
import { type Card } from "../../validations/card.ts";
import { addressDBSchema } from "./address.ts";
import { imageDBSchema } from "./image.ts";

/**
 * Type representing a business card document stored in the database.
 */
export type DBCard = Card & {
  userId: string;
  bizNumber: number;
  likes: Array<string>;
  createdAt?: Date;
  _id: Types.ObjectId;
};

/**
 * Mongoose schema definition for the Card collection.
 */
export const cardDBSchema = new Schema<DBCard>({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  description: { type: String, required: true },
  phone: {
    type: String,
    minlength: 9,
    maxlength: 15,
    required: true,
  },
  email: {
    type: String,
    minlength: 7,
    maxlength: 50,
    required: true,
  },
  web: {
    type: String,
    required: true,
  },
  address: { type: addressDBSchema, required: true },
  image: {
    type: imageDBSchema,
  },
  userId: { type: String, required: true },
  bizNumber: {
    type: Number,
    required: false,
    default: () => Math.floor(1000000 + Math.random() * 9000000),
    unique: true,
  },
  createdAt: {
    type: Date,
    required: false,
    default: Date.now,
  },
  likes: [{ type: String }],
});
