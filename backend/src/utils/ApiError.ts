export class ApiError extends Error {
  public readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = new.target.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class BadRequestError extends ApiError {
  constructor(message = "Bad request") {
    super(400, message);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = "Unauthorized") {
    super(401, message);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = "Forbidden") {
    super(403, message);
  }
}

export class NotFoundError extends ApiError {
  constructor(message = "Not found") {
    super(404, message);
  }
}

export class ConflictError extends ApiError {
  constructor(message = "Conflict") {
    super(409, message);
  }
}

export class PayloadTooLargeError extends ApiError {
  constructor(message = "Payload too large") {
    super(413, message);
  }
}

export class UnsupportedMediaTypeError extends ApiError {
  constructor(message = "Unsupported media type") {
    super(415, message);
  }
}

export class InternalServerError extends ApiError {
  constructor(message = "Internal server error") {
    super(500, message);
  }
}

export class BadGatewayError extends ApiError {
  constructor(message = "Bad gateway") {
    super(502, message);
  }
}
