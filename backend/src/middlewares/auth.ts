import type { Context, Next } from "koa";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

interface JwtPayload {
  id: string;
  username: string;
  email: string;
}

export const authMiddleware = async (ctx: Context, next: Next): Promise<void> => {
  const authHeader = ctx.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    ctx.status = 401;
    ctx.body = { message: "Unauthorized" };
    return;
  }

  const token = authHeader.slice(7);
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    ctx.status = 500;
    ctx.body = { message: "Server misconfiguration" };
    return;
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;

    const user = await User.findById(decoded.id);

    if (!user) {
      ctx.status = 401;
      ctx.body = { message: "Unauthorized" };
      return;
    }

    ctx.state.user = {
      _id: user._id,
      username: user.username,
      email: user.email,
    };

    await next();
  } catch {
    ctx.status = 401;
    ctx.body = { message: "Invalid or expired token" };
  }
};
