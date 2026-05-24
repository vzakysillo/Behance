import Router from "@koa/router";
import { authMiddleware } from "../middlewares/auth.js";
import type { AuthContext } from "../types/koa.js";
import { sendSuccess } from "../utils/httpResponse.js";

const router = new Router({ prefix: "/users" });

router.get("/me", authMiddleware, (ctx: AuthContext) => {
  sendSuccess(ctx, 200, "User profile fetched successfully", { user: ctx.state.user });
});

export default router;
