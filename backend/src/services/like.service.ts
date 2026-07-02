import { type Types } from "mongoose";
import Like from "../models/like.model.js";
import { ensureProjectExists, validateObjectId } from "../utils/validation.js";
import { BadRequestError, ConflictError, NotFoundError } from "../utils/ApiError.js";

const checkDuplicateLike = (error: unknown): never => {
  if (
    error instanceof Error &&
    "code" in error &&
    (error as { code?: number }).code === 11000
  ) {
    throw new ConflictError("Project already liked");
  }

  throw error;
};

export const addLikeToProject = async (
  userId: Types.ObjectId,
  projectId: string
) => {
  await ensureProjectExists(projectId);

  try {
    return await Like.create({ userId, projectId });
  } catch (error) {
    checkDuplicateLike(error);
  }
};

export const getLikesForProject = async (projectId: string) => {
  await ensureProjectExists(projectId);

  return Like.find({ projectId });
};

export const removeLikeFromProject = async (
  userId: Types.ObjectId,
  projectId: string,
  likeId: string
) => {
  await ensureProjectExists(projectId);

  validateObjectId(likeId, "like id");

  const like = await Like.findOneAndDelete({ _id: likeId, userId, projectId });

  if (!like) {
    throw new NotFoundError("Like not found");
  }

  return like;
};
