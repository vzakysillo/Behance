import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { generateToken } from "../utils/generateToken.js";
import type { RegisterBody, LoginBody } from "../types/koa.js";
import { createVerificationToken, consumeVerificationToken } from "./token.service.js";
import { sendVerificationEmail } from "./email.service.js";

const SALT_ROUNDS = 12;

export const registerUser = async ({ userName, email, password }: RegisterBody) => {
  const existing = await User.findOne({ $or: [{ email }, { userName }] });

  if (existing) {
    throw new ApiError(409, "Username or email already in use");
  }

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({ userName, email, password: hashed });

  const token = await createVerificationToken(user._id);
  await sendVerificationEmail(email, token);

  return {
    id: user._id,
    username: user.userName,
    email: user.email,
    isVerified: user.isVerified,
  };
};

export const loginUser = async ({ email, password }: LoginBody): Promise<string> => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  if (!user.isVerified) {
    throw new ApiError(403, "Email not verified. Check your inbox or request a new link");
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    throw new ApiError(401, "Invalid credentials");
  }

  return generateToken(user);
};

export const verifyUser = async (token: string): Promise<void> => {
  const userId = await consumeVerificationToken(token);

  if (!userId) {
    throw new ApiError(400, "Invalid or expired token");
  }

  await User.findByIdAndUpdate(userId, { isVerified: true });
};
