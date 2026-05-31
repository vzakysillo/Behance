import mongoose, { Model } from "mongoose";

export interface ILike {
  userId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
}

const likeSchema = new mongoose.Schema<ILike>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
  },
  { versionKey: false }
);

likeSchema.index({ userId: 1, projectId: 1 }, { unique: true });

const Like: Model<ILike> = mongoose.model<ILike>("Like", likeSchema);

export default Like;
