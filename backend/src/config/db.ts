import mongoose from "mongoose";
import "dotenv/config";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("MONGO_URI is not defined in environment variables");
}

mongoose.connect(MONGO_URI);

const db = mongoose.connection;

db.on("error", (err) => console.error("MongoDB error:", err));
db.on("connected", () => console.log("Connected to MongoDB"));
db.on("disconnected", () => console.log("Disconnected from MongoDB"));

export default mongoose;
