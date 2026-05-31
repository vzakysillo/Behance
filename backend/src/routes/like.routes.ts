import Router from "@koa/router";
import { addLike, getLikes, removeLike } from "../controllers/like.controller.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = new Router({ prefix: "/projects/:projectId/likes" });

router.get("/", getLikes);
router.post("/", authMiddleware, addLike);
router.delete("/", authMiddleware, removeLike);

export default router;
