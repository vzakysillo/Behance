import { registerUser, loginUser, verifyUser } from "../services/auth.service.js";
import type { AuthContext, RegisterBody, LoginBody } from "../types/koa.js";
import { BadRequestError } from "../utils/ApiError.js";
import { created, ok } from "../utils/httpResponse.js";

export const register = async (ctx: AuthContext): Promise<void> => {
  const body = ctx.request.body as RegisterBody;
  const user = await registerUser(body);
  
  created(ctx, "User registered successfully", { user });
};

export const login = async (ctx: AuthContext): Promise<void> => {
  const body = ctx.request.body as LoginBody;
  const token = await loginUser(body);

  ok(ctx, "Logged in successfully", { token });
};

export const verify = async (ctx: AuthContext): Promise<void> => {
  const { token } = ctx.query as { token: string };

  if (!token) {
    throw new BadRequestError("Token is required");
  }

  await verifyUser(token);
  ok(ctx, "Email verified successfully. You can now log in.");
};
