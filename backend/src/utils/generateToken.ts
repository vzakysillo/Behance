import jwt from "jsonwebtoken";
import type { Types } from "mongoose";
import type { IUser } from "../models/user.model.js";

type TokenUser = IUser & {
  _id: Types.ObjectId;
};

export const generateToken = (user: TokenUser): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return jwt.sign(
    {
      id: user._id,
      userName: user.userName,
      email: user.email,
    },
    secret,
    { expiresIn: "1d" }
  );
};
