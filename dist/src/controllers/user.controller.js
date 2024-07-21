"use strict";
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
        this.register = async (req, res) => {
            const dto = req.body;
            await this.userService.register(dto);
            response_helper_1.ResponseHelper.successResponse({
                res,
                statusCode: status_constants_1.HTTP_STATUS_CREATED,
                message: "Validate you account with the link sent to this email",
            });
        };
        /**
         * `POST` /api/user/activate/:activationId
         */
        this.activate = async (req, res) => {
            const { activationId } = req.params;
            const user = await this.userService.activate(activationId);
            response_helper_1.ResponseHelper.successResponse({
                res,
                message: "Account Successfully Verified",
                data: user,
                statusCode: status_constants_1.HTTP_STATUS_OK,
            });
        };
        /**
         * `GET` /api/users/regenerate
         */
        this.regenerateActivation = async (req, res) => {
            const body = req.body;
            const user = await this.userService.regenerateCode(body);
            response_helper_1.ResponseHelper.successResponse({
                res,
                message: "Account Successfully Verified",
                data: user,
                statusCode: status_constants_1.HTTP_STATUS_OK,
            });
        };
        /**
         *  `POST` /api/users/login
         */
        this.login = async (req, res) => {
            const body = req.body;
            const user = await this.userService.login(body);
            response_helper_1.ResponseHelper.successResponse({
                res,
                message: "User Successfully logged in",
                data: user,
                statusCode: status_constants_1.HTTP_STATUS_OK,
            });
        };
        this.forgotPassword = async (req, res) => {
            const body = req.body;
            const tokens = await this.userService.forgotPassword(body);
            response_helper_1.ResponseHelper.successResponse({
                res,
                message: "Reset Password email sent successfully",
                data: tokens,
                statusCode: status_constants_1.HTTP_STATUS_OK,
            });
        };
        this.resetPassword = async (req, res) => {
            const { _id } = req.user;
            const body = req.body;
            await this.userService.resetPassword(body, _id);
            response_helper_1.ResponseHelper.successResponse({
                res,
                message: "Successfully reset user password",
                statusCode: status_constants_1.HTTP_STATUS_OK,
            });
        };
        this.me = async (req, res) => {
            const { _id } = req.user;
            response_helper_1.ResponseHelper.successResponse({
                res,
                message: "Successfully get user",
                data: await this.userDao.get({ _id: _id }),
                statusCode: status_constants_1.HTTP_STATUS_OK,
            });
        };
        this.getById = async (req, res) => {
            const { userId } = req.params;
            response_helper_1.ResponseHelper.successResponse({
                res,
                message: "Successfully get user",
                data: await this.userDao.get({ _id: userId }),
                statusCode: status_constants_1.HTTP_STATUS_OK,
            });
        };
    }
}
exports.UserController = UserController;
