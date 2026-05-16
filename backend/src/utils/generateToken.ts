import jwt from "jsonwebtoken";
import type { IUser } from "../models/user.model.js";

export const generateToken = (user: IUser): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return jwt.sign(
    {
      id: user._id,
      username: user.username,
      email: user.email,
    },
    secret,
    { expiresIn: "1d" }
  );
};
