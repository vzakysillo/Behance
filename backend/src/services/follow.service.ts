import { type Types } from "mongoose";
import Follow from "../models/follow.model.js";
import User from "../models/user.model.js";
import { validateObjectId } from "../utils/validation.js";
import { ConflictError, NotFoundError } from "../utils/ApiError.js";

const checkDuplicateFollow = (error: unknown): never => {
  if (
    error instanceof Error &&
    "code" in error &&
    (error as { code?: number }).code === 11000
  ) {
    throw new ConflictError("Already following this user");
  }

  throw error;
};

const ensureUserExists = async (userId: string): Promise<void> => {
  validateObjectId(userId, "user id");

  const user = await User.exists({ _id: userId });

  if (!user) {
    throw new NotFoundError("User not found");
  }
};

export const followUser = async (
  followerId: Types.ObjectId,
  followingId: string
) => {
  await ensureUserExists(followingId);

  if (followerId.toString() === followingId) {
    throw new ConflictError("Cannot follow yourself");
  }

  try {
    return await Follow.create({ followerId, followingId });
  } catch (error) {
    checkDuplicateFollow(error);
  }
};

export const unfollowUser = async (
  followerId: Types.ObjectId,
  followingId: string
) => {
  validateObjectId(followingId, "user id");

  const follow = await Follow.findOneAndDelete({ followerId, followingId });

  if (!follow) {
    throw new NotFoundError("Follow not found");
  }

  return follow;
};

export const getFollowers = async (userId: string) => {
  validateObjectId(userId, "user id");

  return Follow.find({ followingId: userId }).populate(
    "followerId",
    "userName firstName lastName avatar"
  );
};

export const getFollowing = async (userId: string) => {
  validateObjectId(userId, "user id");

  return Follow.find({ followerId: userId }).populate(
    "followingId",
    "userName firstName lastName avatar"
  );
};
