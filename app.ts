import express, { Express, Request, Response, NextFunction } from "express";
import passport from "passport";
import { i18next } from "./src/config/i18next";
import session from "express-session";
import Queue from "bull";
import dotenv from "dotenv";
import authRoutes from "./src/routes/auth.route";
import connectDB from "./src/config/db";
import { createBullBoard } from "@bull-board/api";
import { BullAdapter } from "@bull-board/api/bullAdapter";
import { ExpressAdapter } from "@bull-board/express";
import cors from "cors";

dotenv.config();

const app: Express = express();
const Port = process.env.PORT || 5000;
const sessionSecret = process.env.SESSION_SECRET || "default-secret-key";

const fileUploadQueue = new Queue("file-uploads", {
  redis: { host: "localhost", port: 6379 },
});

const serverAdapter = new ExpressAdapter();

createBullBoard({
  queues: [new BullAdapter(fileUploadQueue)],
  serverAdapter: serverAdapter,
});

serverAdapter.setBasePath("/admin/queues");
app.use("/admin/queues", serverAdapter.getRouter());
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ status: 500, message: err.message, data: null });
});

connectDB();
app.listen(Port, () => console.log(`App listening on port ${Port}`));

export default app;
