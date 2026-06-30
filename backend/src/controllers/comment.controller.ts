import type { Context } from "koa";
import type { AuthContext } from "../types/koa.js";
import {
  addCommentToProject,
  getCommentsForProject,
  removeCommentFromProject,
  type CreateCommentBody,
} from "../services/comment.service.js";
import { created, ok } from "../utils/httpResponse.js";

export const addComment = async (ctx: AuthContext): Promise<void> => {
  const { projectId } = ctx.params;
  const body = ctx.request.body as CreateCommentBody;
  const comment = await addCommentToProject(ctx.state.user._id, projectId, body);

  created(ctx, "Comment added successfully", { comment });
};

export const getComments = async (ctx: Context): Promise<void> => {
  const { projectId } = ctx.params;
  const comments = await getCommentsForProject(projectId);

  ok(ctx, "Project comments fetched successfully", { comments });
};

export const removeComment = async (ctx: AuthContext): Promise<void> => {
  const { projectId, commentId } = ctx.params;
  const comment = await removeCommentFromProject(
    ctx.state.user._id,
    projectId,
    commentId
  );

  ok(ctx, "Comment removed successfully", { comment });
};
