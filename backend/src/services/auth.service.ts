import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { generateToken } from "../utils/generateToken.js";
import type { RegisterBody, LoginBody } from "../types/koa.js";

const SALT_ROUNDS = 12;

export const registerUser = async ({ username, email, password }: RegisterBody) => {
  const existing = await User.findOne({ $or: [{ email }, { username }] });

  if (existing) {
    throw new ApiError(409, "Username or email already in use");
  }

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await User.create({ username, email, password: hashed });

  return {
    id: user._id,
    username: user.username,
    email: user.email,
    isVerified: user.isVerified,
  };
};

export const loginUser = async ({ email, password }: LoginBody): Promise<string> => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    throw new ApiError(401, "Invalid credentials");
  }

  return generateToken(user);
};
