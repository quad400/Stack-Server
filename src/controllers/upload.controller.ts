import { Request, Response } from "express";
import { ResponseHelper } from "../utils/helpers/response.helper";
import {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NO_CONTENT,
  HTTP_STATUS_OK,
} from "../constants/status.constants";
import { imageUploader } from "../services/upload.service";

/**
 * `POST` /api/upload
 * @param req image
 * @param res data
 */

const uploader = async (req: Request, res: Response) => {
  const file = req.file;

  try {
    if (!file)
      ResponseHelper.httpErrorResponse(
        "Image file is required",
        HTTP_STATUS_NO_CONTENT
      );

    const url = await imageUploader(
      file?.filename as string,
      file?.path as any
    );

    ResponseHelper.successResponse({
      res: res,
      statusCode: HTTP_STATUS_OK,
      data: url?.url,
      message: "Successfully uploaded file",
    });
  } catch (error: any) {
    ResponseHelper.httpErrorResponse(
      error?.message || error,
      HTTP_STATUS_BAD_REQUEST
    );
  }
};

export default uploader;
