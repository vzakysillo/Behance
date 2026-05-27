import type { Context, DefaultState } from "koa";
import type { File } from "formidable";
import type { Types } from "mongoose";

export interface AuthState extends DefaultState {
  user: {
    _id: Types.ObjectId;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    socials: string[];
    skills: string[];
    avatar: string;
    isVerified: boolean;
    projects: Types.ObjectId[];
  };
}

export type AuthContext = Context & { state: AuthState };

export interface RegisterBody {
  userName: string;
  email: string;
  password: string;
}

export interface LoginBody {
  email: string;
  password: string;
}


declare module "koa" {
  interface Request {
    files?: {
      [key: string]: File | File[];
    };
  }
}
