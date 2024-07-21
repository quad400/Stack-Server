import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";

import app from "./app";
import {
  error404,
  exceptionFilter,
} from "./middlewares/exception.middleware";
import { rootRouter } from "./routes";
import connectDB from "./config/db.config";
import {
  CLOUDINARY_APIKEY,
  CLOUDINARY_NAME,
  CLOUDINARY_SECRETKEY,
  MONGODB_URI,
  PORT
} from "./constants/env";

connectDB(MONGODB_URI);

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_APIKEY,
  api_secret: CLOUDINARY_SECRETKEY,
});


app.get("/", (req: Request, res: Response) => {
  res.send("Stack is now running live 🚀");
});

app.use("/api", rootRouter);

app.use(exceptionFilter);
app.get("*", error404());

const server = app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV!} mode on port ${PORT}`
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
