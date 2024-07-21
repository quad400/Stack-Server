"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpException = void 0;
class HttpException extends Error {
    constructor(statusCode, message, success = false) {
        super();
        this.success = false;
        this.message = message;
        this.statusCode = statusCode;
    }
}
exports.HttpException = HttpException;
