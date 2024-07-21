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
exports.UserController = void 0;
const response_helper_1 = require("../utils/helpers/response.helper");
const user_service_1 = require("../services/user.service");
const status_constants_1 = require("../constants/status.constants");
const user_dao_1 = require("../dao/user.dao");
class UserController {
    constructor() {
        this.userService = new user_service_1.UserService();
        this.userDao = new user_dao_1.UserDao();
        /**
         * `POST` /api/user/login
         */
        this.register = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const dto = req.body;
            yield this.userService.register(dto);
            response_helper_1.ResponseHelper.successResponse({
                res,
                statusCode: status_constants_1.HTTP_STATUS_CREATED,
                message: "Validate you account with the link sent to this email",
            });
        });
        /**
         * `POST` /api/user/activate/:activationId
         */
        this.activate = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { activationId } = req.params;
            const user = yield this.userService.activate(activationId);
            response_helper_1.ResponseHelper.successResponse({
                res,
                message: "Account Successfully Verified",
                data: user,
                statusCode: status_constants_1.HTTP_STATUS_OK,
            });
        });
        /**
         * `GET` /api/users/regenerate
         */
        this.regenerateActivation = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const user = yield this.userService.regenerateCode(body);
            response_helper_1.ResponseHelper.successResponse({
                res,
                message: "Account Successfully Verified",
                data: user,
                statusCode: status_constants_1.HTTP_STATUS_OK,
            });
        });
        /**
         *  `POST` /api/users/login
         */
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const user = yield this.userService.login(body);
            response_helper_1.ResponseHelper.successResponse({
                res,
                message: "User Successfully logged in",
                data: user,
                statusCode: status_constants_1.HTTP_STATUS_OK,
            });
        });
        this.forgotPassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const tokens = yield this.userService.forgotPassword(body);
            response_helper_1.ResponseHelper.successResponse({
                res,
                message: "Reset Password email sent successfully",
                data: tokens,
                statusCode: status_constants_1.HTTP_STATUS_OK,
            });
        });
        this.resetPassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { _id } = req.user;
            const body = req.body;
            yield this.userService.resetPassword(body, _id);
            response_helper_1.ResponseHelper.successResponse({
                res,
                message: "Successfully reset user password",
                statusCode: status_constants_1.HTTP_STATUS_OK,
            });
        });
        this.me = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { _id } = req.user;
            response_helper_1.ResponseHelper.successResponse({
                res,
                message: "Successfully get user",
                data: yield this.userDao.get({ _id: _id }),
                statusCode: status_constants_1.HTTP_STATUS_OK,
            });
        });
        this.getById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            response_helper_1.ResponseHelper.successResponse({
                res,
                message: "Successfully get user",
                data: yield this.userDao.get({ _id: userId }),
                statusCode: status_constants_1.HTTP_STATUS_OK,
            });
        });
    }
}
exports.UserController = UserController;
