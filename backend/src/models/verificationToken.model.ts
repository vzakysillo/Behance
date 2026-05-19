import mongoose, { Document, Schema } from "mongoose";

export interface IVerificationToken extends Document {
  userId: mongoose.Types.ObjectId;
  token: string;
  expiresAt: Date;
}

const VerificationTokenSchema = new Schema<IVerificationToken>(
  {
    userId:    { type: Schema.Types.ObjectId, ref: "User", required: true },
    token:     { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
  }
);

VerificationTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const VerificationToken = mongoose.model<IVerificationToken>(
  "verification_tokens",
  VerificationTokenSchema
);
