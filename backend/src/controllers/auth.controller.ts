import { registerUser, loginUser, verifyUser } from "../services/auth.service.js";
import type { AuthContext, RegisterBody, LoginBody } from "../types/koa.js";
import { ApiError } from "../utils/ApiError.js";
import { sendSuccess } from "../utils/httpResponse.js";

export const register = async (ctx: AuthContext): Promise<void> => {
  const body = ctx.request.body as RegisterBody;
  const user = await registerUser(body);
  
  sendSuccess(ctx, 201, "User registered successfully", { user });
};

export const login = async (ctx: AuthContext): Promise<void> => {
  const body = ctx.request.body as LoginBody;
  const token = await loginUser(body);

  sendSuccess(ctx, 200, "Logged in successfully", { token });
};

export const verify = async (ctx: AuthContext): Promise<void> => {
  const { token } = ctx.query as { token: string };

  if (!token) {
    throw new ApiError(400, "Token is required");
  }

  await verifyUser(token);
  sendSuccess(ctx, 200, "Email verified successfully. You can now log in.");
};
