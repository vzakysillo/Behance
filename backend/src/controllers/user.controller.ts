import User, { type IUser } from "../models/user.model.js";
import type { AuthContext } from "../types/koa.js";
import { ConflictError, NotFoundError } from "../utils/ApiError.js";
import { ok } from "../utils/httpResponse.js";
import { validateObjectId } from "../utils/validation.js";
import type { Context } from "koa";
import { getPublicProjectsByUserService } from "../services/project.service.js";

type UpdateUserBody = Partial<
  Pick<
    IUser,
    | "userName"
    | "firstName"
    | "lastName"
    | "socials"
    | "skills"
    | "avatar"
    | "bio"
    | "specialization"
    | "location"
    | "company"
    | "city"
  >
>;

const checkDuplicateUser = (error: unknown): never => {
  if (
    error instanceof Error &&
    "code" in error &&
    (error as { code?: number }).code === 11000
  ) {
    throw new ConflictError("Username already in use");
  }

  throw error;
};

export const getMe = async (ctx: AuthContext): Promise<void> => {
  ok(ctx, "User profile fetched successfully", { user: ctx.state.user });
};

export const updateMe = async (ctx: AuthContext): Promise<void> => {
  const body = ctx.request.body as UpdateUserBody;

  try {
    const user = await User.findByIdAndUpdate(
      ctx.state.user._id,
      {
        userName: body.userName,
        firstName: body.firstName,
        lastName: body.lastName,
        socials: body.socials,
        skills: body.skills,
        avatar: body.avatar,
        bio: body.bio,
        specialization: body.specialization,
        location: body.location,
        company: body.company,
        city: body.city,
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new NotFoundError("User not found");
    }

    ok(ctx, "User updated successfully", { user });
  } catch (error) {
    checkDuplicateUser(error);
  }
};

export const getUserById = async (ctx: Context): Promise<void> => {
  const { id } = ctx.params;
  validateObjectId(id, "user id");

  const user = await User.findById(id).select("-password");

  if (!user) {
    throw new NotFoundError("User not found");
  }

  ok(ctx, "User fetched successfully", { user });
};

export const getPublicProjectsByUser = async (ctx: Context): Promise<void> => {
  const { id } = ctx.params;
  validateObjectId(id, "user id");

  const projects = await getPublicProjectsByUserService(id);

  ok(ctx, "User projects fetched successfully", { projects });
};
