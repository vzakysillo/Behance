import Router from "koa-router";
import { register, login, verify } from "../controllers/auth.controller.js";

const router = new Router({ prefix: "/auth" });

router.post("/register", register);
router.post("/login", login);
router.get("/verify", verify);

export default router;
