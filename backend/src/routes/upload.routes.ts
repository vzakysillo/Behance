import Router from "@koa/router";
import { koaBody } from "koa-body";
import { authMiddleware } from "../middlewares/auth.js";
import { uploadImage } from "../controllers/upload.controller.js";

const router = new Router({ prefix: "/upload" });

// koaBody is applied per-route here (not globally) so multipart parsing only
// happens on this endpoint — the rest of the API keeps using koa-bodyparser.
const multipartParser = koaBody({
  multipart: true,
  urlencoded: false,
  json: false,
  text: false,
  formidable: {
    maxFileSize: 10 * 1024 * 1024, // 10 MB — enforced before the service layer
    filter: ({ mimetype }) =>
      !!mimetype && ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(mimetype),
  },
});

router.post("/image", multipartParser, authMiddleware, uploadImage);

export default router;
