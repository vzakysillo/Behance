import type { Context, Next } from "koa";
import { ApiError } from "../utils/ApiError.js";

export const errorHandler = async (ctx: Context, next: Next): Promise<void> => {
  try {
    await next();
  } catch (err) {
    if (err instanceof ApiError) {
      ctx.status = err.status;
      ctx.body = { message: err.message };
    } else if (err instanceof Error) {
      ctx.status = 500;
      ctx.body = { message: err.message };
      console.error("Unhandled error:", err);
    } else {
      ctx.status = 500;
      ctx.body = { message: "Internal server error" };
    }
  }
};
