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
    register(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            dto.password = yield this.hashHelper.encrypt(dto.password);
            const user = yield this.userDao.create(dto);
            const activationCode = user.generateActivation();
            yield user.save();
            yield this.emailService.sendEmail({
                to: user.email,
                subject: "Welcome to Our Stack",
                template: "register",
                context: { name: user.fullName, code: activationCode },
            });
        });
    }
    activate(activationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userDao.activate(activationId);
            if (!user) {
                throw new http_exception_1.HttpException(status_constants_1.HTTP_STATUS_UNAUTHORIZED, "Verification Code has Expires");
            }
            user.emailVerified = true;
            user.activationCode = undefined;
            user.activationCodeExpire = undefined;
            return user.save();
        });
    }
    regenerateCode(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userDao.getByData(body);
            const activationCode = user.generateActivation();
            yield user.save();
            yield this.emailService.sendEmail({
                to: user.email,
                subject: "Welcome to Our Stack",
                template: "register",
                context: { name: user.fullName, code: activationCode },
            });
        });
    }
    login(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { password } = body;
            const user = yield this.userDao.login(body);
            const matched = yield this.hashHelper.compare(user.password, password);
            if (!matched) {
                throw new http_exception_1.HttpException(status_constants_1.HTTP_STATUS_UNAUTHORIZED, "Invalid login details");
            }
            const tokens = this.jwtHelper.generateToken({ _id: user === null || user === void 0 ? void 0 : user._id });
            return { tokens };
        });
    }
    forgotPassword(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userDao.getByData(body);
            const activationCode = user.generateActivation();
            yield user.save();
            yield this.emailService.sendEmail({
                to: user.email,
                subject: "Forgot your password on Stack?",
                template: "forgotpass",
                context: { name: user.fullName, code: activationCode },
            });
            const tokens = this.jwtHelper.generateToken({ _id: user === null || user === void 0 ? void 0 : user._id });
            return { tokens };
        });
    }
    resetPassword(body, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { confirmPassword, password } = body;
            if (confirmPassword !== password) {
                response_helper_1.ResponseHelper.httpErrorResponse("Password mismatch", status_constants_1.HTTP_STATUS_BAD_REQUEST);
            }
            const user = yield this.userDao.get({ _id: userId });
            user.password = yield this.hashHelper.encrypt(password);
            yield user.save();
        });
    }
}
exports.UserService = UserService;
