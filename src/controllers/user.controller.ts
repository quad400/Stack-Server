import { Request, Response } from "express";
import {
  ICreateUser,
  IGetUserBy,
  ILogin,
  IResetPass,
} from "../interfaces/user.interface";
import { ResponseHelper } from "../utils/helpers/response.helper";
import { UserService } from "../services/user.service";
import {
  HTTP_STATUS_CREATED,
  HTTP_STATUS_OK,
} from "../constants/status.constants";
import { HttpException } from "../utils/exceptions/http.exception";
import { UserDao } from "../dao/user.dao";

export class UserController {
  private readonly userService = new UserService();
  private readonly userDao = new UserDao();

  /**
   * `POST` /api/user/login
   */

  register = async (req: Request, res: Response) => {
    const dto = req.body as ICreateUser;
    await this.userService.register(dto);

    ResponseHelper.successResponse({
      res,
      statusCode: HTTP_STATUS_CREATED,
      message: "Validate you account with the link sent to this email",
    });
  };

  /**
   * `POST` /api/user/activate/:activationId
   */

  activate = async (req: Request, res: Response) => {
    const { activationId } = req.params;

    const user = await this.userService.activate(activationId);

    ResponseHelper.successResponse({
      res,
      message: "Account Successfully Verified",
      data: user,
      statusCode: HTTP_STATUS_OK,
    });
  };

  /**
   * `GET` /api/users/regenerate
   */

  regenerateActivation = async (req: Request, res: Response) => {
    const body = req.body as IGetUserBy;
    const user = await this.userService.regenerateCode(body);

    ResponseHelper.successResponse({
      res,
      message: "Account Successfully Verified",
      data: user,
      statusCode: HTTP_STATUS_OK,
    });
  };

  /**
   *  `POST` /api/users/login
   */

  login = async (req: Request, res: Response) => {
    const body = req.body as ILogin;

    const user = await this.userService.login(body);

    ResponseHelper.successResponse({
      res,
      message: "User Successfully logged in",
      data: user,
      statusCode: HTTP_STATUS_OK,
    });
  };

  forgotPassword = async (req: Request, res: Response) => {
    const body = req.body as IGetUserBy;

    const tokens = await this.userService.forgotPassword(body);

    ResponseHelper.successResponse({
      res,
      message: "Reset Password email sent successfully",
      data: tokens,
      statusCode: HTTP_STATUS_OK,
    });
  };

  resetPassword = async (req: Request, res: Response) => {
    const { _id } = req.user;

    const body = req.body as IResetPass;

    await this.userService.resetPassword(body, _id);
    ResponseHelper.successResponse({
      res,
      message: "Successfully reset user password",
      statusCode: HTTP_STATUS_OK,
    });
  };

  me = async (req: Request, res: Response) => {
    const { _id } = req.user;

    ResponseHelper.successResponse({
      res,
      message: "Successfully get user",
      data: await this.userDao.get({ _id: _id }),
      statusCode: HTTP_STATUS_OK,
    });
  };

  getById = async (req: Request, res: Response) => {
    const { userId } = req.params;

    ResponseHelper.successResponse({
      res,
      message: "Successfully get user",
      data: await this.userDao.get({ _id: userId }),
      statusCode: HTTP_STATUS_OK,
    });
  };
}
