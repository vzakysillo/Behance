import mongoose from "mongoose";
import { BadRequestError, NotFoundError } from "./ApiError.js";
import Project from "../models/project.model.js";

export const validateObjectId = (id: string, name: string = "id"): void => {
  if (!mongoose.isValidObjectId(id)) {
    throw new BadRequestError(`Invalid ${name}`);
  }
};

export const ensureProjectExists = async (projectId: string): Promise<void> => {
  validateObjectId(projectId, "project id");

  const project = await Project.exists({ _id: projectId });

  if (!project) {
    throw new NotFoundError("Project not found");
  }
};
