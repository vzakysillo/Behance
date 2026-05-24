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

export function createErrorResponse(status: number, message: string): ApiResponse<never> {
  return {
    status,
    message,
  };
}
