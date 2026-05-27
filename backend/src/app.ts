import Koa from "koa";
import bodyParser from "koa-bodyparser";
import cors from "@koa/cors";
import { connectDB } from "./config/db.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import projectRoutes from "./routes/project.routes.js";

const app = new Koa();

app.use(
  cors({
    origin: process.env.FRONTEND_URI,
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);

app.use(bodyParser());
app.use(errorHandler);

app.use(authRoutes.routes());
app.use(authRoutes.allowedMethods());

app.use(userRoutes.routes());
app.use(userRoutes.allowedMethods());

app.use(uploadRoutes.routes());
app.use(uploadRoutes.allowedMethods());

app.use(projectRoutes.routes());
app.use(projectRoutes.allowedMethods());

connectDB();

export default app;
