import type { Context } from "koa";
import { registerUser, loginUser, verifyUser } from "../services/auth.service.js";
import type { RegisterBody, LoginBody } from "../types/koa.js";

export const register = async (ctx: Context): Promise<void> => {
  const body = ctx.request.body as RegisterBody;
  const user = await registerUser(body);

  ctx.status = 201;
  ctx.body = { user };
};

export const login = async (ctx: Context): Promise<void> => {
  const body = ctx.request.body as LoginBody;
  const token = await loginUser(body);

  ctx.body = { token };
};

export const verify = async (ctx: Context) => {
  const { token } = ctx.query as { token: string };
  if (!token) {
    ctx.status = 400;
    ctx.body = { error: "Token is required" };
    return;
  }
  await verifyUser(token);
  ctx.status = 200;
  ctx.body = { message: "Email verified successfully. You can now log in." };
};
