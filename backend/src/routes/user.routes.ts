import Router from "@koa/router";
import { getMe, updateMe } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = new Router({ prefix: "/users" });

router.get("/me", authMiddleware, getMe);
router.put("/me", authMiddleware, updateMe);
router.patch("/me", authMiddleware, updateMe);

export default router;
