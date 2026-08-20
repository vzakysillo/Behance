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

export const getAppreciatedProjectsForUser = async (userId: Types.ObjectId) => {
  const likes = await Like.find({ userId }).select("projectId").lean();
  const projectIds = likes.map((l) => l.projectId);

  if (projectIds.length === 0) return [];

  const { default: Project } = await import("../models/project.model.js");

  return Project.aggregate([
    { $match: { _id: { $in: projectIds } } },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "projectId",
        as: "likes",
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "projectId",
        as: "comments",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "author",
      },
    },
    {
      $addFields: {
        likesCount: { $size: "$likes" },
        commentsCount: { $size: "$comments" },
        author: { $first: "$author" },
      },
    },
    {
      $project: {
        likes: 0,
        comments: 0,
        "author.password": 0,
      },
    },
    { $sort: { _id: -1 } },
  ]);
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
