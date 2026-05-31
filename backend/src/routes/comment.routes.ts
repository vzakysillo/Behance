import Router from "@koa/router";
import {
  addComment,
  getComments,
  removeComment,
} from "../controllers/comment.controller.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = new Router({ prefix: "/projects/:projectId/comments" });

router.get("/", getComments);
router.post("/", authMiddleware, addComment);
router.delete("/:commentId", authMiddleware, removeComment);

export default router;
