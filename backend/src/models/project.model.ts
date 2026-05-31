import mongoose, { Model } from "mongoose";

export interface IProject {
  userId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  cover: string;
  photos: string[];
}

const projectSchema = new mongoose.Schema<IProject>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: { type: String, required: true, unique: true },
    description: { type: String, default: null },

    cover: { type: String, default: null },

    photos: { type: [String], default: [] },
  },
  { versionKey: false }
);

const Project: Model<IProject> = mongoose.model<IProject>(
  "Project",
  projectSchema
);

export default Project;
