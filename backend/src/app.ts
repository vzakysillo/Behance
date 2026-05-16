import Koa from "koa";
import bodyParser from "koa-bodyparser";
import cors from '@koa/cors';
import { errorHandler } from "./middlewares/errorHandler.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import "./config/db.js";


const app = new Koa();

app.use(cors());

app.use(cors({
  origin: 'http://localhost:5173',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use(bodyParser());
app.use(errorHandler);


app.use(authRoutes.routes());
app.use(authRoutes.allowedMethods());

app.use(userRoutes.routes());
app.use(userRoutes.allowedMethods());

export default app;
