import Router from "@koa/router";
import { listPublicProjects, getPublicProject } from "../controllers/project.controller.js";

const router = new Router({ prefix: "/projects" });

router.get("/feed", listPublicProjects);
router.get("/feed/:id", getPublicProject);

export default router;
