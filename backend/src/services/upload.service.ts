import fs from "fs";
import type { UploadApiResponse } from "cloudinary";
import cloudinary from "../config/cloudinary.js";
import {
  BadGatewayError,
  InternalServerError,
  PayloadTooLargeError,
  UnsupportedMediaTypeError,
} from "../utils/ApiError.js";
import {
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_IMAGE_FILE_SIZE_BYTES,
  isAllowedImageMimeType,
} from "../utils/uploadFile.js";

export interface UploadedFile {
  filepath: string;
  mimetype: string | null;
  size: number;
  originalFilename: string | null;
}

export async function uploadImageToCloudinary(file: UploadedFile): Promise<string> {
  if (!isAllowedImageMimeType(file.mimetype)) {
    throw new UnsupportedMediaTypeError(
      `Unsupported file type. Allowed: ${ALLOWED_IMAGE_MIME_TYPES.join(", ")}`
    );
  }

  if (file.size > MAX_IMAGE_FILE_SIZE_BYTES) {
    throw new PayloadTooLargeError("File too large. Maximum size is 10 MB");
  }

  return new Promise<string>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "uploads", resource_type: "image" },
      (error, result: UploadApiResponse | undefined) => {
        if (error) {
          reject(new BadGatewayError(`Cloudinary upload failed: ${error.message}`));
          return;
        }
        if (!result) {
          reject(new BadGatewayError("Cloudinary returned an empty response"));
          return;
        }
        resolve(result.secure_url);
      }
    );

    fs.createReadStream(file.filepath)
      .on("error", (err) =>
        reject(new InternalServerError(`Failed to read temp file: ${err.message}`))
      )
      .pipe(stream);
  });
}
