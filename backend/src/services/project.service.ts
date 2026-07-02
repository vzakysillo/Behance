import { type Types } from "mongoose";
import Project, { type IProject } from "../models/project.model.js";
import Comment from "../models/comment.model.js";
import Like from "../models/like.model.js";
import { validateObjectId } from "../utils/validation.js";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../utils/ApiError.js";

type ProjectPayload = Pick<IProject, "name" | "description" | "cover" | "photos" | "tags" | "category" | "toolsUsed" | "disableComments">;

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

  if (body.photos !== undefined) {
    payload.photos = body.photos;
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
  return Project.find({ userId });
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
      $addFields: {
        likesCount: { $size: "$likes" },
      },
    },
    {
      $project: {
        likes: 0,
      },
    },
    {
      $sort: { _id: -1 },
    },
  ]);
};

export const getProjectById = async (projectId: string) => {
  validateObjectId(projectId, "project id");

  const project = await Project.findById(projectId);

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

  const project = await Project.findById(projectId);

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
