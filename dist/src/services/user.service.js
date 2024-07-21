"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_dao_1 = require("../dao/user.dao");
const http_exception_1 = require("../utils/exceptions/http.exception");
const email_helper_1 = __importDefault(require("../utils/helpers/email.helper"));
const hash_helper_1 = require("../utils/helpers/hash.helper");
const response_helper_1 = require("../utils/helpers/response.helper");
const jwt_helper_1 = require("../utils/helpers/jwt.helper");
const status_constants_1 = require("../constants/status.constants");
class UserService {
    constructor() {
        this.hashHelper = new hash_helper_1.Hash();
        this.userDao = new user_dao_1.UserDao();
        this.jwtHelper = new jwt_helper_1.JWTHelper();
        this.emailService = new email_helper_1.default();
    }
    async register(dto) {
        dto.password = await this.hashHelper.encrypt(dto.password);
        const user = await this.userDao.create(dto);
        const activationCode = user.generateActivation();
        await user.save();
        await this.emailService.sendEmail({
            to: user.email,
            subject: "Welcome to Our Stack",
            template: "register",
            context: { name: user.fullName, code: activationCode },
        });
    }
    async activate(activationId) {
        const user = await this.userDao.activate(activationId);
        if (!user) {
            throw new http_exception_1.HttpException(status_constants_1.HTTP_STATUS_UNAUTHORIZED, "Verification Code has Expires");
        }
        user.emailVerified = true;
        user.activationCode = undefined;
        user.activationCodeExpire = undefined;
        return user.save();
    }
    async regenerateCode(body) {
        const user = await this.userDao.getByData(body);
        const activationCode = user.generateActivation();
        await user.save();
        await this.emailService.sendEmail({
            to: user.email,
            subject: "Welcome to Our Stack",
            template: "register",
            context: { name: user.fullName, code: activationCode },
        });
    }
    async login(body) {
        const { password } = body;
        const user = await this.userDao.login(body);
        const matched = await this.hashHelper.compare(user.password, password);
        if (!matched) {
            throw new http_exception_1.HttpException(status_constants_1.HTTP_STATUS_UNAUTHORIZED, "Invalid login details");
        }
        const tokens = this.jwtHelper.generateToken({ _id: user?._id });
        return { tokens };
    }
    async forgotPassword(body) {
        const user = await this.userDao.getByData(body);
        const activationCode = user.generateActivation();
        await user.save();
        await this.emailService.sendEmail({
            to: user.email,
            subject: "Forgot your password on Stack?",
            template: "forgotpass",
            context: { name: user.fullName, code: activationCode },
        });
        const tokens = this.jwtHelper.generateToken({ _id: user?._id });
        return { tokens };
    }
    async resetPassword(body, userId) {
        const { confirmPassword, password } = body;
        if (confirmPassword !== password) {
            response_helper_1.ResponseHelper.httpErrorResponse("Password mismatch", status_constants_1.HTTP_STATUS_BAD_REQUEST);
        }
        const user = await this.userDao.get({ _id: userId });
        user.password = await this.hashHelper.encrypt(password);
        await user.save();
    }
}
exports.UserService = UserService;
