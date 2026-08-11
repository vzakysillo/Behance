import mongoose, { Model } from "mongoose";

export interface IUser {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;

  socials: string[];
  skills: string[];
  bio: string;

  specialization: string;
  location: string;
  company: string;
  city: string;

  avatar: string;
  isVerified: boolean;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    userName: { type: String, required: true, unique: true },
    firstName: { type: String, default: null },
    lastName: { type: String, default: null },

    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },

    socials: { type: [String], default: [] },
    skills: { type: [String], default: [] },
    bio: { type: String, default: null },

    specialization: { type: String, default: null },
    location: { type: String, default: null },
    company: { type: String, default: null },
    city: { type: String, default: null },

    avatar: { type: String, default: null },

    isVerified: { type: Boolean, default: false },
  },
  { versionKey: false }
);

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
