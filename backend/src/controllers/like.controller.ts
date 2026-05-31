import type { AuthContext } from "../types/koa.js";
import {
  addLikeToProject,
  getLikesForProject,
  removeLikeFromProject,
} from "../services/like.service.js";
import { created, ok } from "../utils/httpResponse.js";

export const addLike = async (ctx: AuthContext): Promise<void> => {
  const { projectId } = ctx.params;
  const like = await addLikeToProject(ctx.state.user._id, projectId);

  created(ctx, "Project liked successfully", { like });
};

export const getLikes = async (ctx: AuthContext): Promise<void> => {
  const { projectId } = ctx.params;
  const likes = await getLikesForProject(projectId);

  ok(ctx, "Project likes fetched successfully", { likes });
};

export const removeLike = async (ctx: AuthContext): Promise<void> => {
  const { projectId } = ctx.params;
  const like = await removeLikeFromProject(ctx.state.user._id, projectId);

  ok(ctx, "Project like removed successfully", { like });
};
