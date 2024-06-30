import { Response } from "express";
import { HTTP_STATUS_OK } from "../../constants/status.constants";
import { HttpException } from "../exceptions/http.exception";
import {
  DatabaseException,
  ExceptionCodes,
} from "../exceptions/database.exception";

export class ResponseHelper {
  static successResponse<T>(options: {
    res: Response;
    data?: T;
    message?: string;
    statusCode: number;
  }) {
    const { data, message, res, statusCode } = options;

    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }
  static httpErrorResponse(message: string, statusCode: number) {
    throw new HttpException(statusCode, message);
  }

  static databaseErrorResponse(message: string, statusCode: ExceptionCodes) {
    throw new DatabaseException(statusCode, message);
  }
}
