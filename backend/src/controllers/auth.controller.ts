import type { Context } from "koa";
import { registerUser, loginUser } from "../services/auth.service.js";
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
