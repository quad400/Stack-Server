"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const http_exception_1 = require("../utils/exceptions/http.exception");
const status_constants_1 = require("../constants/status.constants");
const jwt_helper_1 = require("../utils/helpers/jwt.helper");
const dao_helper_1 = require("../utils/helpers/dao.helper");
const daoHelper = new dao_helper_1.DaoHelper();
const protect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token) {
            next(new http_exception_1.HttpException(status_constants_1.HTTP_STATUS_UNAUTHORIZED, "Valid token is required"));
        }
        const jwtHelper = new jwt_helper_1.JWTHelper();
        const payload = jwtHelper.verifyAccessToken(token);
        req.user = { _id: payload._id };
        next();
    }
    catch (error) {
        next(new http_exception_1.HttpException(status_constants_1.HTTP_STATUS_UNAUTHORIZED, "Valid token is required"));
    }
});
exports.protect = protect;
