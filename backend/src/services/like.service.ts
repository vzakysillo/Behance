import mongoose, { type Types } from "mongoose";
import Like from "../models/like.model.js";
import Project from "../models/project.model.js";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../utils/ApiError.js";

const validateProjectId = (projectId: string): void => {
  if (!mongoose.isValidObjectId(projectId)) {
    throw new BadRequestError("Invalid project id");
  }
};

const ensureProjectExists = async (projectId: string): Promise<void> => {
  validateProjectId(projectId);

  const project = await Project.exists({ _id: projectId });

  if (!project) {
    throw new NotFoundError("Project not found");
  }
};

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
  projectId: string
) => {
  await ensureProjectExists(projectId);

  const like = await Like.findOneAndDelete({ userId, projectId });

  if (!like) {
    throw new NotFoundError("Like not found");
  }

  return like;
};
