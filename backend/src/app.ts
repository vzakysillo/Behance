import Koa from "koa";
import bodyParser from "koa-bodyparser";
import cors from "@koa/cors";
import { connectDB } from "./config/db.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import feedRoutes from "./routes/feed.routes.js";
import projectRoutes from "./routes/project.routes.js";
import likeRoutes from "./routes/like.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import followRoutes from "./routes/follow.routes.js";

const app = new Koa();

app.use(
  cors({
    origin: process.env.FRONTEND_URI,
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowHeaders: ["Authorization", "Content-Type"],
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

app.use(feedRoutes.routes());
app.use(feedRoutes.allowedMethods());

app.use(projectRoutes.routes());
app.use(projectRoutes.allowedMethods());

app.use(likeRoutes.routes());
app.use(likeRoutes.allowedMethods());

app.use(commentRoutes.routes());
app.use(commentRoutes.allowedMethods());

app.use(followRoutes.routes());
app.use(followRoutes.allowedMethods());

connectDB();

export default app;
