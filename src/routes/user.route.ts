import { Router } from "express";
import { validator } from "../utils/helpers/validators.helper";
import {
  EmailDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
} from "../dto/user.dto";
import { exceptionEscalator } from "../middlewares/exception.middleware";
import { UserController } from "../controllers/user.controller";
import { protect } from "../middlewares/auth.middleware";

export const userRoutes = Router();

const userController = new UserController();

userRoutes.post(
  "/register",
  validator({ dto: new RegisterDto() }),
  exceptionEscalator(userController.register)
);

userRoutes.get(
  "/regenerate",
  validator({ dto: new EmailDto() }),
  exceptionEscalator(userController.regenerateActivation)
);

userRoutes.post(
  "/login",
  validator({ dto: new LoginDto() }),
  exceptionEscalator(userController.login)
);

userRoutes.post(
  "/activate/:activationId",
  exceptionEscalator(userController.activate)
);

userRoutes.post(
  "/forgot-password",
  validator({ dto: new EmailDto() }),
  exceptionEscalator(userController.forgotPassword)
);

userRoutes.post(
  "/reset-password",
  validator({ dto: new ResetPasswordDto() }),
  protect,
  exceptionEscalator(userController.resetPassword)
);

userRoutes.get("/me", protect, exceptionEscalator(userController.me));

userRoutes.get("/:userId", exceptionEscalator(userController.getById));
