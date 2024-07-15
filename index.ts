import http from "http";
import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";

import app from "./app";
import {
  error404,
  errorHandler,
  exceptionEscalator,
  exceptionFilter,
} from "./src/middlewares/exception.middleware";
import { rootRouter } from "./src/routes";
import connectDB from "./src/config/db.config";
import {
  CLOUDINARY_APIKEY,
  CLOUDINARY_NAME,
  CLOUDINARY_SECRETKEY,
  MONGO_URI,
} from "./src/constants/env";

connectDB(MONGO_URI);

console.log(CLOUDINARY_NAME, CLOUDINARY_SECRETKEY)
cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_APIKEY,
  api_secret: CLOUDINARY_SECRETKEY,
});

const port = process.env.PORT || 3000;
const server = http.createServer(app);

app.get("/", (req: Request, res: Response) => {
  res.send("Stack is now running live 🚀");
});

app.use("/api", rootRouter);

app.use(exceptionFilter);
app.get("*", error404());

server.listen(port, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV!} mode on port ${port}`
  );
});

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err, err.message);
  process.exit(1);
});

process.on("unhandledRejection", (err: any) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err, err.message);
  server.close(() => {
    process.exit(1);
  });
});
