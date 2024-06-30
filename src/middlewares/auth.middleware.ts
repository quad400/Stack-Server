import { NextFunction, Request, Response } from "express";
import { HttpException } from "../utils/exceptions/http.exception";
import { HTTP_STATUS_UNAUTHORIZED } from "../constants/status.constants";
import { JWTHelper } from "../utils/helpers/jwt.helper";
import { JwtPayload } from "jsonwebtoken";
import { DaoHelper } from "../utils/helpers/dao.helper";
import User from "../models/user.model";

const daoHelper = new DaoHelper();

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      next(
        new HttpException(HTTP_STATUS_UNAUTHORIZED, "Valid token is required")
      );
    }

    const jwtHelper = new JWTHelper();

    const payload = jwtHelper.verifyAccessToken(token as string) as JwtPayload;
    
    req.user = { _id: payload._id };
    next()
  } catch (error) {
    next(
      new HttpException(HTTP_STATUS_UNAUTHORIZED, "Valid token is required")
    );
  }
};
