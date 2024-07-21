import { Router } from "express";
import multer from "multer";
import uploader from "../controllers/upload.controller";
import { exceptionEscalator } from "../middlewares/exception.middleware";
import * as fs from 'fs';
import * as path from 'path';
import {UPLOAD_DIR} from "../constants/env";


if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});


const upload = multer({ storage });

export const uploadRoutes = Router();


uploadRoutes.post("/", upload.single("image"), exceptionEscalator(uploader));
