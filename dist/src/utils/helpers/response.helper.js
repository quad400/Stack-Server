"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseHelper = void 0;
const http_exception_1 = require("../exceptions/http.exception");
const database_exception_1 = require("../exceptions/database.exception");
class ResponseHelper {
    static successResponse(options) {
        const { data, message, res, statusCode } = options;
        return res.status(statusCode).json({
            success: true,
            message,
            data,
        });
    }
    static httpErrorResponse(message, statusCode) {
        throw new http_exception_1.HttpException(statusCode, message);
    }
    static databaseErrorResponse(message, statusCode) {
        throw new database_exception_1.DatabaseException(statusCode, message);
    }
}
exports.ResponseHelper = ResponseHelper;
