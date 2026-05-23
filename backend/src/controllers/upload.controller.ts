import type { File } from "formidable";
import { uploadImageToCloudinary, type UploadedFile } from "../services/upload.service.js";
import { ApiError } from "../utils/ApiError.js";
import type { AuthContext } from "../types/koa.js";
import User from "../models/user.model.js";


export const uploadImage = async (ctx: AuthContext): Promise<void> => {
  const files = ctx.request.files;

  if (!files || !files["image"]) {
    throw new ApiError(400, 'No file received. Send the image under the field name "image"');
  }

  // koa-body may return a single File or an array — normalise to one
  const raw = files["image"];
  const file: File = Array.isArray(raw) ? raw[0] : raw;

  const uploadedFile: UploadedFile = {
    filepath: file.filepath,
    mimetype: file.mimetype,
    size: file.size,
    originalFilename: file.originalFilename,
  };

  const url = await uploadImageToCloudinary(uploadedFile);
  const user = await User.findByIdAndUpdate(
    ctx.state.user._id,
    { avatar: url },
    { new: true }
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  ctx.status = 201;
  ctx.body = { url, user };
};
