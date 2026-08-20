import type { Context } from "koa";
import type { AuthContext } from "../types/koa.js";
import {
  addLikeToProject,
  getAppreciatedProjectsForUser,
  getLikesForProject,
  removeLikeFromProject,
} from "../services/like.service.js";
import { created, ok } from "../utils/httpResponse.js";
import { validateObjectId } from "../utils/validation.js";
import { Types } from "mongoose";

export const addLike = async (ctx: AuthContext): Promise<void> => {
  const { projectId } = ctx.params;
  const like = await addLikeToProject(ctx.state.user._id, projectId);

  created(ctx, "Project liked successfully", { like });
};

export const getLikes = async (ctx: Context): Promise<void> => {
  const { projectId } = ctx.params;
  const likes = await getLikesForProject(projectId);

  ok(ctx, "Project likes fetched successfully", { likes });
};

export const getAppreciations = async (ctx: AuthContext): Promise<void> => {
  const projects = await getAppreciatedProjectsForUser(ctx.state.user._id);

  ok(ctx, "Appreciated projects fetched successfully", { projects });
};

export const getUserAppreciations = async (ctx: Context): Promise<void> => {
  const { id } = ctx.params;
  validateObjectId(id, "user id");

  const projects = await getAppreciatedProjectsForUser(new Types.ObjectId(id));

  ok(ctx, "User appreciated projects fetched successfully", { projects });
};

export const removeLike = async (ctx: AuthContext): Promise<void> => {
  const { projectId, likeId } = ctx.params;
  const like = await removeLikeFromProject(ctx.state.user._id, projectId, likeId);

  ok(ctx, "Project like removed successfully", { like });
};
