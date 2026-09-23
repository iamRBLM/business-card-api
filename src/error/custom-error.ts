/**
 * Base error class for HTTP exceptions.
 */
export class HttpError extends Error {
  statusCode: number;

  constructor(
    message: string = "Internal Server Error",
    statusCode: number = 500,
  ) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
  }
}

/**
 * Error class for 404 Not Found errors.
 */
export class NotFoundError extends HttpError {
  constructor(message: string = "Not Found") {
    super(message, 404);
    this.name = "NotFoundError";
  }
}
