import Router from "@koa/router";
import { koaBody } from "koa-body";
import { authMiddleware } from "../middlewares/auth.js";
import { uploadImage } from "../controllers/upload.controller.js";

const router = new Router({ prefix: "/upload" });

const multipartParser = koaBody({
  multipart: true,
  urlencoded: false,
  json: false,
  text: false,
  formidable: {
    maxFileSize: 10 * 1024 * 1024, // 10 MB
    filter: ({ mimetype }) =>
      !!mimetype && ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(mimetype),
  },
});

router.post("/image", multipartParser, authMiddleware, uploadImage);

export default router;
