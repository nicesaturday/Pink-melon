import express from "express";
import morgan from "morgan";
import session from "express-session";
import flash from "express-flash";
import MongoStore from "connect-mongo";
import { localsMiddleware } from "./middlewares";
import rootRouter from "./routers/rootRouter";
import apiRouter from "./routers/apiRouter";
import usersRouter from "./routers/userRouter";


const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge : 600000 },
    rolling : true,
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
);
app.use(flash());
app.use(localsMiddleware);
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("assets"));

app.use("/", rootRouter);
app.use("/api",apiRouter);
app.use("/users",usersRouter);


export default app;
