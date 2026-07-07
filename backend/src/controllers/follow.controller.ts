import type { Context } from "koa";
import type { AuthContext } from "../types/koa.js";
import {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
} from "../services/follow.service.js";
import { created, ok } from "../utils/httpResponse.js";

export const follow = async (ctx: AuthContext): Promise<void> => {
  const { userId } = ctx.params;
  const follow = await followUser(ctx.state.user._id, userId);

  created(ctx, "User followed successfully", { follow });
};

export const unfollow = async (ctx: AuthContext): Promise<void> => {
  const { userId } = ctx.params;
  const follow = await unfollowUser(ctx.state.user._id, userId);

  ok(ctx, "User unfollowed successfully", { follow });
};

export const followers = async (ctx: Context): Promise<void> => {
  const { userId } = ctx.params;
  const users = await getFollowers(userId);

  ok(ctx, "Followers fetched successfully", { users });
};

export const following = async (ctx: Context): Promise<void> => {
  const { userId } = ctx.params;
  const users = await getFollowing(userId);

  ok(ctx, "Following fetched successfully", { users });
};
