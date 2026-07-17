import { type Types } from "mongoose";
import Comment, { type IComment } from "../models/comment.model.js";
import Project from "../models/project.model.js";
import { ensureProjectExists, validateObjectId } from "../utils/validation.js";
import { BadRequestError, ForbiddenError, NotFoundError } from "../utils/ApiError.js";

export type CreateCommentBody = Pick<IComment, "text">;

export const addCommentToProject = async (
  userId: Types.ObjectId,
  projectId: string,
  body: CreateCommentBody
) => {
  await ensureProjectExists(projectId);

  const project = await Project.findById(projectId).select("disableComments");
  if (project?.disableComments) {
    throw new ForbiddenError("Comments are disabled for this project");
  }

  if (!body.text?.trim()) {
    throw new BadRequestError("Comment text is required");
  }

  return Comment.create({
    userId,
    projectId,
    text: body.text,
  });
};

export const getCommentsForProject = async (projectId: string) => {
  await ensureProjectExists(projectId);

  return Comment.find({ projectId }).sort({ createdAt: -1 });
};

export const removeCommentFromProject = async (
  userId: Types.ObjectId,
  projectId: string,
  commentId: string
) => {
  await ensureProjectExists(projectId);
  validateObjectId(commentId, "comment id");

  const comment = await Comment.findOneAndDelete({
    _id: commentId,
    userId,
    projectId,
  });

  if (!comment) {
    throw new NotFoundError("Comment not found");
  }

  return comment;
};
