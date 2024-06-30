import { UserDao } from "../dao/user.dao";
import {
  ICreateUser,
  IGetUser,
  IGetUserBy,
  ILogin,
  IResetPass,
} from "../interfaces/user.interface";
import { HttpException } from "../utils/exceptions/http.exception";
import EmailService from "../utils/helpers/email.helper";
import { Hash } from "../utils/helpers/hash.helper";
import { ResponseHelper } from "../utils/helpers/response.helper";
import { JWTHelper } from "../utils/helpers/jwt.helper";
import {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_UNAUTHORIZED,
} from "../constants/status.constants";

export class UserService {
  private hashHelper = new Hash();
  private userDao = new UserDao();
  private jwtHelper = new JWTHelper();

  private emailService = new EmailService();

  async register(dto: ICreateUser) {
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

  async activate(activationId: string) {
    const user = await this.userDao.activate(activationId);

    if (!user) {
      throw new HttpException(
        HTTP_STATUS_UNAUTHORIZED,
        "Verification Code has Expires"
      );
    }
    user.emailVerified = true;
    user.activationCode = undefined;
    user.activationCodeExpire = undefined;

    return user.save();
  }

  async regenerateCode(body: IGetUserBy) {
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

  async login(body: ILogin) {
    const { password } = body;
    const user = await this.userDao.login(body);

    const matched = await this.hashHelper.compare(user.password, password);

    if (!matched) {
      throw new HttpException(
        HTTP_STATUS_UNAUTHORIZED,
        "Invalid login details"
      );
    }

    const tokens = this.jwtHelper.generateToken({ _id: user?._id });

    return { tokens };
  }

  async forgotPassword(body: IGetUserBy) {
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

  async resetPassword(body: IResetPass, userId: string) {
    const { confirmPassword, password } = body;

    if (confirmPassword !== password) {
      ResponseHelper.httpErrorResponse(
        "Password mismatch",
        HTTP_STATUS_BAD_REQUEST
      );
    }

    const user = await this.userDao.get({_id: userId});
    
    user.password = await this.hashHelper.encrypt(password);

    await user.save();
  }
}
