/**
 * Regular expressions for security and input validation.
 *
 * passwordRegex: Checks that the password has at least one lowercase letter,
 * one uppercase letter, one number, one special character, and is at least 7 characters long.
 */
export const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*-])[A-Za-z\d!@#$\%^&*-]{7,}$/;

/**
 * phoneRegex: Validates Israeli phone numbers (mobile and landline),
 * allowing optional country codes, area codes, and hyphens.
 */
export const phoneRegex =
  /^(?:(?:\+972|0)?(?:[23489]|5[0-9]|7[2-9]))-?[1-9]\d{6}$/;
