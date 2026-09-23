import { Schema } from "mongoose";
import { type Image } from "../../validations/image.ts";

/**
 * Mongoose schema definition for images (embedded document).
 */
export const imageDBSchema = new Schema<Image>(
  {
    alt: {
      type: String,
      maxlength: 100,
      required: false,
      default: "",
    },
    url: {
      type: String,
      minlength: 5,
      maxlength: 250,
      required: true,
    },
  },
  { _id: false },
);
