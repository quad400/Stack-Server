"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.error404 = exports.exceptionEscalator = exports.exceptionFilter = exports.errorHandler = void 0;
const database_exception_1 = require("../utils/exceptions/database.exception");
const http_exception_1 = require("../utils/exceptions/http.exception");
const status_constants_1 = require("../constants/status.constants");
function errorHandler(err, req, res, next) {
    console.error(err.stack);
    res.status(500).json({ message: err.message || "Internal Server Error" });
}
exports.errorHandler = errorHandler;
const exceptionFilter = (error, req, res, next) => {
    if (error instanceof database_exception_1.DatabaseException) {
        return res.status((0, database_exception_1.translateToStatusCode)(error.code)).json({
            success: false,
            message: error.message,
        });
    }
    else if (error instanceof http_exception_1.HttpException) {
        return res.status(error.statusCode).json({
            success: error.success,
            message: error.message,
        });
    }
    else {
        return res.status(status_constants_1.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
        });
    }
};
exports.exceptionFilter = exceptionFilter;
const exceptionEscalator = (controller) => async (req, res, next) => {
    try {
        await controller(req, res);
    }
    catch (err) {
        next(err);
    }
};
exports.exceptionEscalator = exceptionEscalator;
const error404 = () => {
    return (_, res) => {
        res.status(status_constants_1.HTTP_STATUS_NOT_FOUND).json({ message: "Not found" });
    };
};
exports.error404 = error404;
