import mongoose, { type Types } from "mongoose";
import Comment, { type IComment } from "../models/comment.model.js";
import Project from "../models/project.model.js";
import { BadRequestError, NotFoundError } from "../utils/ApiError.js";

export type CreateCommentBody = Pick<IComment, "text">;

const validateProjectId = (projectId: string): void => {
  if (!mongoose.isValidObjectId(projectId)) {
    throw new BadRequestError("Invalid project id");
  }
};

const validateCommentId = (commentId: string): void => {
  if (!mongoose.isValidObjectId(commentId)) {
    throw new BadRequestError("Invalid comment id");
  }
};

const ensureProjectExists = async (projectId: string): Promise<void> => {
  validateProjectId(projectId);

  const project = await Project.exists({ _id: projectId });

  if (!project) {
    throw new NotFoundError("Project not found");
  }
};

export const addCommentToProject = async (
  userId: Types.ObjectId,
  projectId: string,
  body: CreateCommentBody
) => {
  await ensureProjectExists(projectId);

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
  validateCommentId(commentId);

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
