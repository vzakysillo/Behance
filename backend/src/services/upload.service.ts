import fs from "fs";
import type { UploadApiResponse } from "cloudinary";
import cloudinary from "../config/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export interface UploadedFile {
  filepath: string;
  mimetype: string | null;
  size: number;
  originalFilename: string | null;
}

export async function uploadImageToCloudinary(file: UploadedFile): Promise<string> {
  if (!file.mimetype || !ALLOWED_MIME_TYPES.has(file.mimetype)) {
    throw new ApiError(
      415,
      `Unsupported file type. Allowed: ${[...ALLOWED_MIME_TYPES].join(", ")}`
    );
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new ApiError(413, "File too large. Maximum size is 10 MB");
  }

  return new Promise<string>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "uploads", resource_type: "image" },
      (error, result: UploadApiResponse | undefined) => {
        if (error) {
          reject(new ApiError(502, `Cloudinary upload failed: ${error.message}`));
          return;
        }
        if (!result) {
          reject(new ApiError(502, "Cloudinary returned an empty response"));
          return;
        }
        resolve(result.secure_url);
      }
    );

    fs.createReadStream(file.filepath)
      .on("error", (err) => reject(new ApiError(500, `Failed to read temp file: ${err.message}`)))
      .pipe(stream);
  });
}
