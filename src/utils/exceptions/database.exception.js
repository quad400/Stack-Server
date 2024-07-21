"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseException = exports.translateToStatusCode = exports.ExceptionCodesToStatusCodeMappings = exports.ExceptionCodes = void 0;
const status_constants_1 = require("../../constants/status.constants");
var ExceptionCodes;
(function (ExceptionCodes) {
    ExceptionCodes["DUPLICATE_ENTRY"] = "DUPLICATE_ENTRY";
    ExceptionCodes["NOT_FOUND"] = "NOT_FOUND";
    ExceptionCodes["PERMISSION_DENIED"] = "PERMISSION_DENIED";
})(ExceptionCodes || (exports.ExceptionCodes = ExceptionCodes = {}));
exports.ExceptionCodesToStatusCodeMappings = {
    [ExceptionCodes.NOT_FOUND]: status_constants_1.HTTP_STATUS_NOT_FOUND,
    [ExceptionCodes.PERMISSION_DENIED]: status_constants_1.HTTP_STATUS_FORBIDDEN,
    [ExceptionCodes.DUPLICATE_ENTRY]: status_constants_1.HTTP_STATUS_NOT_ACCEPTABLE,
};
function translateToStatusCode(code) {
    return exports.ExceptionCodesToStatusCodeMappings[code];
}
exports.translateToStatusCode = translateToStatusCode;
class DatabaseException extends Error {
    constructor(code, message) {
        super();
        this.name = this.constructor.name;
        this.code = code;
        this.message = message;
        Object.setPrototypeOf(this, DatabaseException.prototype);
    }
}
exports.DatabaseException = DatabaseException;
