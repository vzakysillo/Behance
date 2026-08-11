import { Types } from "mongoose";
import Project, { type IProject } from "../models/project.model.js";
import Comment from "../models/comment.model.js";
import Like from "../models/like.model.js";
import { validateObjectId } from "../utils/validation.js";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../utils/ApiError.js";

type ProjectPayload = Pick<IProject,   "name" | "description" | "cover" | "assets" | "tags" | "categories" | "toolsUsed" | "disableComments">;

export type CreateProjectBody = Pick<ProjectPayload, "name"> &
  Partial<Omit<ProjectPayload, "name">>;

export type UpdateProjectBody = Partial<ProjectPayload>;

const checkDuplicateProject = (error: unknown): never => {
  if (
    error instanceof Error &&
    "code" in error &&
    (error as { code?: number }).code === 11000
  ) {
    throw new ConflictError("Project name already in use");
  }

  throw error;
};

const ensureUserOwnsProject = async (
  userId: Types.ObjectId,
  projectId: string
): Promise<void> => {
  validateObjectId(projectId, "project id");

  const project = await Project.exists({ _id: projectId, userId });

  if (!project) {
    throw new NotFoundError("Project not found");
  }
};

const getProjectPayload = (
  body: CreateProjectBody | UpdateProjectBody
): UpdateProjectBody => {
  const payload: UpdateProjectBody = {};

  if (body.name !== undefined) {
    payload.name = body.name;
  }

  if (body.description !== undefined) {
    payload.description = body.description;
  }

  if (body.cover !== undefined) {
    payload.cover = body.cover;
  }

  if (body.assets !== undefined) {
    const cover = body.cover;
    payload.assets = body.assets.filter(
      (asset, index) =>
        typeof asset === "string" &&
        asset.length > 0 &&
        asset !== cover &&
        body.assets!.indexOf(asset) === index
    );
  }

  if (body.tags !== undefined) {
    payload.tags = body.tags;
  }

  if (body.categories !== undefined) {
    payload.categories = body.categories;
  }

  if (body.toolsUsed !== undefined) {
    payload.toolsUsed = body.toolsUsed;
  }

  if (body.disableComments !== undefined) {
    payload.disableComments = body.disableComments;
  }

  return payload;
};

export const createProjectForUser = async (
  userId: Types.ObjectId,
  body: CreateProjectBody
) => {
  if (!body.name) {
    throw new BadRequestError("Project name is required");
  }

  try {
    const project = await Project.create({
      ...getProjectPayload(body),
      userId,
    });

    return project;
  } catch (error) {
    checkDuplicateProject(error);
  }
};

export const getProjectsForUser = async (userId: Types.ObjectId) => {
  return Project.aggregate([
    { $match: { userId } },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "projectId",
        as: "likes",
      },
    },
    {
      $addFields: {
        likesCount: { $size: "$likes" },
      },
    },
    {
      $project: { likes: 0 },
    },
    { $sort: { _id: -1 } },
  ]);
};

export const getAllProjects = async () => {
  return Project.aggregate([
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
    {
      $sort: { _id: -1 },
    },
  ]);
};

export const getPublicProjectsByUserService = async (userId: string) => {
  return Project.aggregate([
    { $match: { userId: new Types.ObjectId(userId) } },
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
    {
      $sort: { _id: -1 },
    },
  ]);
};

export const getProjectById = async (projectId: string) => {
  validateObjectId(projectId, "project id");

  const projects = await Project.aggregate([
    { $match: { _id: new Types.ObjectId(projectId) } },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "author",
      },
    },
    { $addFields: { author: { $first: "$author" } } },
    { $project: { "author.password": 0 } },
  ]);

  const project = projects[0] ?? null;

  if (!project) {
    throw new NotFoundError("Project not found");
  }

  return project;
};

export const getProjectForUser = async (
  userId: Types.ObjectId,
  projectId: string
) => {
  await ensureUserOwnsProject(userId, projectId);

  const projects = await Project.aggregate([
    { $match: { _id: new Types.ObjectId(projectId) } },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "author",
      },
    },
    { $addFields: { author: { $first: "$author" } } },
    { $project: { "author.password": 0 } },
  ]);

  const project = projects[0] ?? null;

  if (!project) {
    throw new NotFoundError("Project not found");
  }

  return project;
};

export const updateProjectForUser = async (
  userId: Types.ObjectId,
  projectId: string,
  body: UpdateProjectBody
) => {
  await ensureUserOwnsProject(userId, projectId);

  try {
    const project = await Project.findByIdAndUpdate(
      projectId,
      getProjectPayload(body),
      { new: true, runValidators: true }
    );

    if (!project) {
      throw new NotFoundError("Project not found");
    }

    return project;
  } catch (error) {
    checkDuplicateProject(error);
  }
};

export const deleteProjectForUser = async (
  userId: Types.ObjectId,
  projectId: string
) => {
  await ensureUserOwnsProject(userId, projectId);

  const project = await Project.findByIdAndDelete(projectId);

  if (!project) {
    throw new NotFoundError("Project not found");
  }

  await Promise.all([
    Like.deleteMany({ projectId: project._id }),
    Comment.deleteMany({ projectId: project._id }),
  ]);

  return project;
};
