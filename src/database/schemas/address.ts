import { Schema } from "mongoose";
import { type Address } from "../../validations/address.ts";

/**
 * Mongoose schema definition for addresses (embedded document).
 */
export const addressDBSchema = new Schema<Address>({
  city: {
    type: String,
    minlength: 2,
    maxlength: 50,
    required: true,
  },
  state: {
    type: String,
    minlength: 2,
    maxlength: 255,
    required: false,
    default: "",
  },
  country: {
    type: String,
    minlength: 2,
    maxlength: 50,
    required: true,
  },
  street: {
    type: String,
    minlength: 2,
    maxlength: 100,
    required: true,
  },
  zip: {
    type: String,
    maxlength: 30,
    required: false,
    default: "",
  },
  houseNumber: {
    type: Number,
    minlength: 1,
    maxlength: 99999,
    required: true,
  },
});