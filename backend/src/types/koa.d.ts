import type { Context, DefaultContext, DefaultState } from "koa";
import type { Types } from "mongoose";

export interface AuthState extends DefaultState {
  user: {
    _id: Types.ObjectId;
    username: string;
    email: string;
  };
}

export type AuthContext = Context & { state: AuthState };

export interface RegisterBody {
  username: string;
  email: string;
  password: string;
}

export interface LoginBody {
  email: string;
  password: string;
}
