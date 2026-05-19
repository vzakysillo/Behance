import mongoose, { Model } from "mongoose";

export interface IUser {
  userName: string;
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;

  socials: string[];
  skills: string[];

  avatar?: string;
  isVerified: boolean;

  portfolios: mongoose.Types.ObjectId[];
}

const userSchema = new mongoose.Schema<IUser>(
  {
    userName: { type: String, required: true, unique: true },
    firstName: { type: String },
    lastName: { type: String },

    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },

    socials: { type: [String], default: [] },
    skills: { type: [String], default: [] },

    avatar: { type: String },

    isVerified: { type: Boolean, default: false },

    portfolios: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Portfolio",
      },
    ],
  },
  { versionKey: false }
);

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;