"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadRoutes = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const upload_controller_1 = __importDefault(require("../controllers/upload.controller"));
const exception_middleware_1 = require("../middlewares/exception.middleware");
exports.uploadRoutes = (0, express_1.Router)();
const storage = (0, multer_1.default)({ dest: "/upload" });
exports.uploadRoutes.post("/", storage.single("image"), (0, exception_middleware_1.exceptionEscalator)(upload_controller_1.default));
