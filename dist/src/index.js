"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const app_1 = __importDefault(require("./app"));
const exception_middleware_1 = require("./middlewares/exception.middleware");
const routes_1 = require("./routes");
const db_config_1 = __importDefault(require("./config/db.config"));
const env_1 = require("./constants/env");
(0, db_config_1.default)(env_1.MONGODB_URI);
cloudinary_1.v2.config({
    cloud_name: env_1.CLOUDINARY_NAME,
    api_key: env_1.CLOUDINARY_APIKEY,
    api_secret: env_1.CLOUDINARY_SECRETKEY,
});
const port = process.env.PORT || 3000;
app_1.default.get("/", (req, res) => {
    res.send("Stack is now running live 🚀");
});
app_1.default.use("/api", routes_1.rootRouter);
app_1.default.use(exception_middleware_1.exceptionFilter);
app_1.default.get("*", (0, exception_middleware_1.error404)());
const server = app_1.default.listen(port, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
});
process.on("uncaughtException", (err) => {
    console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
    console.log(err, err.message);
    process.exit(1);
});
process.on("unhandledRejection", (err) => {
    console.log("UNHANDLED REJECTION! 💥 Shutting down...");
    console.log(err, err.message);
    server.close(() => {
        process.exit(1);
    });
});
