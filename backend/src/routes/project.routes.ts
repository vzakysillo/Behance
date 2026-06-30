import Router from "@koa/router";
import {
  createProject,
  deleteProject,
  getMyProject,
  listMyProjects,
  updateProject,
} from "../controllers/project.controller.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = new Router({ prefix: "/projects" });

router.post("/", authMiddleware, createProject);
router.get("/", authMiddleware, listMyProjects);
router.get("/:id", authMiddleware, getMyProject);
router.patch("/:id", authMiddleware, updateProject);
router.delete("/:id", authMiddleware, deleteProject);

export default router;
