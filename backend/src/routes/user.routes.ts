import Router from "koa-router";
import { authMiddleware } from "../middlewares/auth.js";
import type { AuthContext } from "../types/koa.js";

const router = new Router({ prefix: "/users" });

router.get("/me", authMiddleware, (ctx: AuthContext) => {
  ctx.body = { user: ctx.state.user };
});

export default router;
