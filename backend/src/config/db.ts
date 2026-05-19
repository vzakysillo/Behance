import mongoose from "mongoose";

const MONGO_URI = String(process.env.MONGO_URI);

if (!MONGO_URI) {
  throw new Error("MONGO_URI is not defined in environment variables");
}

export async function connectDB(): Promise<void> {
  mongoose.connection.on("error", (err) => console.error("MongoDB error:", err));
  mongoose.connection.on("connected", () => console.log("Connected to MongoDB"));
  mongoose.connection.on("disconnected", () => console.log("Disconnected from MongoDB"));

  await mongoose.connect(MONGO_URI);
}

export default mongoose;
