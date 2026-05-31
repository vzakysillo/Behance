import type { Next } from "koa";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import type { AuthContext } from "../types/koa.js";
import { InternalServerError, UnauthorizedError } from "../utils/ApiError.js";

interface JwtPayload {
  id: string;
  userName: string;
  email: string;
}

export const authMiddleware = async (ctx: AuthContext, next: Next): Promise<void> => {
  const authHeader = ctx.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    throw new UnauthorizedError();
  }

  const token = authHeader.slice(7);
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new InternalServerError("Server misconfiguration");
  }

  let decoded: JwtPayload;

  try {
    decoded = jwt.verify(token, secret) as JwtPayload;
  } catch {
    throw new UnauthorizedError("Invalid or expired token");
  }

  const user = await User.findById(decoded.id);

  if (!user) {
    throw new UnauthorizedError();
  }

  ctx.state.user = {
    _id: user._id,
    userName: user.userName,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    socials: user.socials,
    skills: user.skills,
    avatar: user.avatar,
    isVerified: user.isVerified,
  };

  await next();
};
