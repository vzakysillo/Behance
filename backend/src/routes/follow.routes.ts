import Router from "@koa/router";
import { follow, unfollow, followers, following } from "../controllers/follow.controller.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = new Router({ prefix: "/users/:userId/follow" });

router.get("/followers", followers);
router.get("/following", following);
router.post("/", authMiddleware, follow);
router.delete("/", authMiddleware, unfollow);

export default router;
