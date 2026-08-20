import Router from "@koa/router";
import { getMe, updateMe, getUserById, getPublicProjectsByUser } from "../controllers/user.controller.js";
import { getAppreciations, getUserAppreciations } from "../controllers/like.controller.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = new Router({ prefix: "/users" });

router.get("/me", authMiddleware, getMe);
router.patch("/me", authMiddleware, updateMe);
router.get("/me/appreciations", authMiddleware, getAppreciations);
router.get("/:id", getUserById);
router.get("/:id/projects", getPublicProjectsByUser);
router.get("/:id/appreciations", getUserAppreciations);

export default router;
