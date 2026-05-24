import Router from "@koa/router";
import { koaBody } from "koa-body";
import { authMiddleware } from "../middlewares/auth.js";
import { uploadImage } from "../controllers/upload.controller.js";
import { isAllowedImageMimeType, MAX_IMAGE_FILE_SIZE_BYTES } from "../utils/uploadFile.js";

const router = new Router({ prefix: "/upload" });

const multipartParser = koaBody({
  multipart: true,
  urlencoded: false,
  json: false,
  text: false,
  formidable: {
    maxFileSize: MAX_IMAGE_FILE_SIZE_BYTES,
    filter: ({ mimetype }) => isAllowedImageMimeType(mimetype),
  },
});

router.post("/image", multipartParser, authMiddleware, uploadImage);

export default router;
