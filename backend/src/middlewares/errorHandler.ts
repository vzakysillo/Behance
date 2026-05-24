import type { Context, Next } from "koa";
import { ApiError } from "../utils/ApiError.js";
import { createErrorResponse } from "../utils/httpResponse.js";

export const errorHandler = async (ctx: Context, next: Next): Promise<void> => {
  try {
    await next();
  } catch (err) {
    if (err instanceof ApiError) {
      ctx.status = err.status;
      ctx.body = createErrorResponse(err.status, err.message);
    } else if (err instanceof Error) {
      ctx.status = 500;
      ctx.body = createErrorResponse(500, "Internal server error");
      console.error("Unhandled error:", err);
    } else {
      ctx.status = 500;
      ctx.body = createErrorResponse(500, "Internal server error");
    }
  }
};
