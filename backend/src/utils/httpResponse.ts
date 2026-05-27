import type { Context } from "koa";

interface ApiResponse<T> {
  status: number;
  message: string;
  data?: T;
}

export function sendSuccess<T>(
  ctx: Context,
  status: number,
  message: string,
  data?: T
): void {
  ctx.status = status;

  const response: ApiResponse<T> = {
    status,
    message,
  };

  if (data !== undefined) {
    response.data = data;
  }

  ctx.body = response;
}

export function ok<T>(ctx: Context, message: string, data?: T): void {
  sendSuccess(ctx, 200, message, data);
}

export function created<T>(ctx: Context, message: string, data?: T): void {
  sendSuccess(ctx, 201, message, data);
}

export function createErrorResponse(status: number, message: string): ApiResponse<never> {
  return {
    status,
    message,
  };
}
