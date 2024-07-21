"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const http_exception_1 = require("../utils/exceptions/http.exception");
const status_constants_1 = require("../constants/status.constants");
const jwt_helper_1 = require("../utils/helpers/jwt.helper");
const dao_helper_1 = require("../utils/helpers/dao.helper");
const daoHelper = new dao_helper_1.DaoHelper();
const protect = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
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
};
exports.protect = protect;
