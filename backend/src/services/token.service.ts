import crypto from "crypto";
import mongoose from "mongoose";
import { VerificationToken } from "../models/verificationToken.model.js";

const TOKEN_TTL_MS = 60 * 60 * 1000;

export async function createVerificationToken(
  userId: mongoose.Types.ObjectId
): Promise<string> {
  await VerificationToken.deleteMany({ userId });

  const token = crypto.randomBytes(32).toString("hex");
  await VerificationToken.create({
    userId,
    token,
    expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
  });

  return token;
}

export async function consumeVerificationToken(
  token: string
): Promise<mongoose.Types.ObjectId | null> {
  const record = await VerificationToken.findOneAndDelete({
    token,
    expiresAt: { $gt: new Date() },
  });

  return record ? record.userId : null;
}
