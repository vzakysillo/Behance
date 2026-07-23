import type { Context } from "koa";

interface ApiResponse<T> {
  message: string;
  data?: T;
}

export function sendSuccess<T>(
  ctx: Context,
  message: string,
  data?: T
): void {

  const response: ApiResponse<T> = {
    message,
  };

  if (data !== undefined) {
    response.data = data;
  }

  ctx.body = response;
}

export function ok<T>(ctx: Context, message: string, data?: T): void {
  sendSuccess(ctx, message, data);
}

export function created<T>(ctx: Context, message: string, data?: T): void {
  ctx.status = 201;
  sendSuccess(ctx, message, data);
}

export function createErrorResponse(status: number, message: string): ApiResponse<never> {
  return {
    message
  };
}
