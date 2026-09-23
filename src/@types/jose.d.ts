import "jose";

/**
 * Extend the JWTPayload type from the 'jose' library to include our custom user fields.
 */
declare module "jose" {
  interface JWTPayload {
    _id?: string;
    isBusiness?: boolean;
    isAdmin?: boolean;
  }
}
