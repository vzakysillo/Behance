import mongoose from "mongoose";
import Project, { type IProject } from "../models/project.model.js";
import User from "../models/user.model.js";
import type { AuthContext } from "../types/koa.js";
import { BadRequestError, ConflictError, NotFoundError } from "../utils/ApiError.js";
import { created, ok } from "../utils/httpResponse.js";

const getProjectId = (id: string) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new BadRequestError("Invalid project id");
  }

  return new mongoose.Types.ObjectId(id);
};

const checkDuplicateName = (error: unknown): never => {
  if (
    error instanceof Error &&
    "code" in error &&
    (error as { code?: number }).code === 11000
  ) {
    throw new ConflictError("Project name already in use");
  }

  throw error;
};

export const createProject = async (ctx: AuthContext): Promise<void> => {
  const body = ctx.request.body as Partial<IProject>;

  if (!body.name) {
    throw new BadRequestError("Project name is required");
  }

  try {
    const project = await Project.create(body);

    await User.findByIdAndUpdate(ctx.state.user._id, {
      $addToSet: { projects: project._id },
    });

    created(ctx, "Project created successfully", { project });
  } catch (error) {
    checkDuplicateName(error);
  }
};

export const getProjects = async (ctx: AuthContext): Promise<void> => {
  const user = await User.findById(ctx.state.user._id).populate("projects");

  if (!user) {
    throw new NotFoundError("User not found");
  }

  ok(ctx, "Projects fetched successfully", { projects: user.projects });
};

export const getProject = async (ctx: AuthContext): Promise<void> => {
  const projectId = getProjectId(ctx.params.id);
  const user = await User.findOne({
    _id: ctx.state.user._id,
    projects: projectId,
  });

  if (!user) {
    throw new NotFoundError("Project not found");
  }

  const project = await Project.findById(projectId);

  if (!project) {
    throw new NotFoundError("Project not found");
  }

  ok(ctx, "Project fetched successfully", { project });
};

export const updateProject = async (ctx: AuthContext): Promise<void> => {
  const projectId = getProjectId(ctx.params.id);
  const user = await User.findOne({
    _id: ctx.state.user._id,
    projects: projectId,
  });

  if (!user) {
    throw new NotFoundError("Project not found");
  }

  try {
    const project = await Project.findByIdAndUpdate(
      projectId,
      ctx.request.body as Partial<IProject>,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!project) {
      throw new NotFoundError("Project not found");
    }

    ok(ctx, "Project updated successfully", { project });
  } catch (error) {
    checkDuplicateName(error);
  }
};

export const deleteProject = async (ctx: AuthContext): Promise<void> => {
  const projectId = getProjectId(ctx.params.id);
  const user = await User.findOne({
    _id: ctx.state.user._id,
    projects: projectId,
  });

  if (!user) {
    throw new NotFoundError("Project not found");
  }

  const project = await Project.findByIdAndDelete(projectId);

  if (!project) {
    throw new NotFoundError("Project not found");
  }

  await User.findByIdAndUpdate(ctx.state.user._id, {
    $pull: { projects: projectId },
  });

  ok(ctx, "Project deleted successfully", { project });
};
