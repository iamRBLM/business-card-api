import { Schema } from "mongoose";
import { type Name } from "../../validations/name.ts";

/**
 * Mongoose schema definition for user names (embedded document).
 */
export const nameDBSchema = new Schema<Name>(
  {
    first: {
      type: String,
      minLength: 2,
      maxLength: 20,
      trim: true,
      required: true,
    },
    middle: {
      type: String,
      minLength: 0,
      maxLength: 20,
      trim: true,
      required: false,
      default: "",
    },
    last: {
      type: String,
      minLength: 2,
      maxLength: 20,
      trim: true,
      required: true,
    },
  },
  { _id: false },
);