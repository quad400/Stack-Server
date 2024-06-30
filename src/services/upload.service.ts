import { v2 as cloudinary } from "cloudinary";
import { ResponseHelper } from "../utils/helpers/response.helper";
import { HTTP_STATUS_BAD_REQUEST } from "../constants/status.constants";

export const imageUploader = async (name: string, picture: any) => {
  try {
    const uploader = await cloudinary.uploader.upload(picture, {
      public_id: name,
      folder: "Stack",
    });
    return uploader;
  } catch (error: any) {
    ResponseHelper.httpErrorResponse(
      error?.message || error,
      HTTP_STATUS_BAD_REQUEST
    );
  }
};
