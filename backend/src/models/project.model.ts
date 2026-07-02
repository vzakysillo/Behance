import mongoose, { Model } from "mongoose";

export interface IProject {
  userId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  cover: string;
  photos: string[];
  tags: string[];
  category: string;
  toolsUsed: string[];
  disableComments: boolean;
  createdAt: Date;
  updatedAt: Date;
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
    tags: { type: [String], default: [] },
    category: { type: String, default: "" },
    toolsUsed: { type: [String], default: [] },
    disableComments: { type: Boolean, default: false },
  },
  { versionKey: false, timestamps: true }
);

const Project: Model<IProject> = mongoose.model<IProject>(
  "Project",
  projectSchema
);

export default Project;
