import Koa from "koa";
import bodyParser from "koa-bodyparser";
import cors from '@koa/cors';
import { errorHandler } from "./middlewares/errorHandler.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import "./config/db.js";
import "dotenv/config";


const app = new Koa();

app.use(cors());

app.use(cors({
  origin: process.env.FRONTEND_URI,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use(bodyParser());
app.use(errorHandler);


app.use(authRoutes.routes());
app.use(authRoutes.allowedMethods());

app.use(userRoutes.routes());
app.use(userRoutes.allowedMethods());

export default app;
