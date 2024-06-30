import { Router } from "express";
import multer from "multer";
import uploader from "../controllers/upload.controller";
import { exceptionEscalator } from "../middlewares/exception.middleware";
export const uploadRoutes = Router();

const storage = multer({ dest: "/upload" });

uploadRoutes.post("/", storage.single("image"), exceptionEscalator(uploader));
