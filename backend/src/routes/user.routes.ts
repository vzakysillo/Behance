import Router from "@koa/router";
import { getMe, updateMe, getUserById, getPublicProjectsByUser } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = new Router({ prefix: "/users" });

router.get("/me", authMiddleware, getMe);
router.patch("/me", authMiddleware, updateMe);
router.get("/:id", getUserById);
router.get("/:id/projects", getPublicProjectsByUser);

export default router;
