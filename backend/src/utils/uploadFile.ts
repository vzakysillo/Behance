import type { File } from "formidable";
import type { UploadedFile } from "../services/upload.service.js";
import { BadRequestError } from "./ApiError.js";

export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export const MAX_IMAGE_FILE_SIZE_BYTES = 10 * 1024 * 1024;

const allowedImageMimeTypeSet = new Set<string>(ALLOWED_IMAGE_MIME_TYPES);
const missingImageMessage = 'No file received. Send the image under the field name "image"';

export function isAllowedImageMimeType(mimetype: string | null | undefined): boolean {
  return !!mimetype && allowedImageMimeTypeSet.has(mimetype);
}

export function getSingleUploadedFile(file: File | File[] | undefined): File {
  if (!file) {
    throw new BadRequestError(missingImageMessage);
  }

  const singleFile = Array.isArray(file) ? file[0] : file;

  if (!singleFile) {
    throw new BadRequestError(missingImageMessage);
  }

  return singleFile;
}

export function toUploadedFile(file: File): UploadedFile {
  return {
    filepath: file.filepath,
    mimetype: file.mimetype,
    size: file.size,
    originalFilename: file.originalFilename,
  };
}
