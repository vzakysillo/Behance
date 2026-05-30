import mongoose, { type Types } from "mongoose";
import Project, { type IProject } from "../models/project.model.js";
import User from "../models/user.model.js";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../utils/ApiError.js";

type ProjectPayload = Pick<IProject, "name" | "description" | "cover" | "photos">;

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

const validateProjectId = (projectId: string): void => {
  if (!mongoose.isValidObjectId(projectId)) {
    throw new BadRequestError("Invalid project id");
  }
};

const ensureUserOwnsProject = async (
  userId: Types.ObjectId,
  projectId: string
): Promise<void> => {
  validateProjectId(projectId);

  const user = await User.findOne({ _id: userId, projects: projectId });

  if (!user) {
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
    const project = await Project.create(getProjectPayload(body));

    await User.findByIdAndUpdate(userId, {
      $addToSet: { projects: project._id },
    });

    return project;
  } catch (error) {
    checkDuplicateProject(error);
  }
};

export const getProjectsForUser = async (userId: Types.ObjectId) => {
  const user = await User.findById(userId).populate("projects");

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return user.projects;
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

  await User.findByIdAndUpdate(userId, {
    $pull: { projects: project._id },
  });

  return project;
};
