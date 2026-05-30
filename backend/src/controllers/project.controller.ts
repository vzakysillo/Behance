import type { AuthContext } from "../types/koa.js";
import {
  createProjectForUser,
  deleteProjectForUser,
  getProjectForUser,
  getProjectsForUser,
  updateProjectForUser,
  type CreateProjectBody,
  type UpdateProjectBody,
} from "../services/project.service.js";
import { created, ok } from "../utils/httpResponse.js";

export const createProject = async (ctx: AuthContext): Promise<void> => {
  const body = ctx.request.body as CreateProjectBody;
  const project = await createProjectForUser(ctx.state.user._id, body);

  created(ctx, "Project created successfully", { project });
};

export const getProjects = async (ctx: AuthContext): Promise<void> => {
  const projects = await getProjectsForUser(ctx.state.user._id);

  ok(ctx, "Projects fetched successfully", { projects });
};

export const getProject = async (ctx: AuthContext): Promise<void> => {
  const { id } = ctx.params;
  const project = await getProjectForUser(ctx.state.user._id, id);

  ok(ctx, "Project fetched successfully", { project });
};

export const updateProject = async (ctx: AuthContext): Promise<void> => {
  const { id } = ctx.params;
  const body = ctx.request.body as UpdateProjectBody;
  const project = await updateProjectForUser(ctx.state.user._id, id, body);

  ok(ctx, "Project updated successfully", { project });
};

export const deleteProject = async (ctx: AuthContext): Promise<void> => {
  const { id } = ctx.params;
  const project = await deleteProjectForUser(ctx.state.user._id, id);

  ok(ctx, "Project deleted successfully", { project });
};
