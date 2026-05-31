import Router from "@koa/router";
import {
  createProject,
  deleteProject,
  getFeedProject,
  getFeedProjects,
  getProject,
  getProjects,
  updateProject,
} from "../controllers/project.controller.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = new Router({ prefix: "/projects" });

router.post("/", authMiddleware, createProject);
router.get("/feed", getFeedProjects);
router.get("/feed/:id", getFeedProject);
router.get("/", authMiddleware, getProjects);
router.get("/:id", authMiddleware, getProject);
router.put("/:id", authMiddleware, updateProject);
router.patch("/:id", authMiddleware, updateProject);
router.delete("/:id", authMiddleware, deleteProject);

export default router;
