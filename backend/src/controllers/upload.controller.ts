import { uploadImageToCloudinary, type UploadedFile } from "../services/upload.service.js";
import { ApiError } from "../utils/ApiError.js";
import { sendSuccess } from "../utils/httpResponse.js";
import { getSingleUploadedFile, toUploadedFile } from "../utils/uploadFile.js";
import type { AuthContext } from "../types/koa.js";
import User from "../models/user.model.js";

export const uploadImage = async (ctx: AuthContext): Promise<void> => {
  const file = getSingleUploadedFile(ctx.request.files?.image);
  const uploadedFile: UploadedFile = toUploadedFile(file);

  const url = await uploadImageToCloudinary(uploadedFile);
  const user = await User.findByIdAndUpdate(
    ctx.state.user._id,
    { avatar: url },
    { new: true }
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  sendSuccess(ctx, 201, "Image uploaded successfully", { url, user });
};
