import mongoose, { Model } from "mongoose";

export interface IFollow {
  followerId: mongoose.Types.ObjectId;
  followingId: mongoose.Types.ObjectId;
}

const followSchema = new mongoose.Schema<IFollow>(
  {
    followerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    followingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { versionKey: false }
);

followSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

const Follow: Model<IFollow> = mongoose.model<IFollow>("Follow", followSchema);

export default Follow;
