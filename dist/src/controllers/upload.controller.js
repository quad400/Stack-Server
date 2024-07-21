"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const response_helper_1 = require("../utils/helpers/response.helper");
const status_constants_1 = require("../constants/status.constants");
const upload_service_1 = require("../services/upload.service");
/**
 * `POST` /api/upload
 * @param req image
 * @param res data
 */
const uploader = async (req, res) => {
    const file = req.file;
    try {
        if (!file)
            response_helper_1.ResponseHelper.httpErrorResponse("Image file is required", status_constants_1.HTTP_STATUS_NO_CONTENT);
        const url = await (0, upload_service_1.imageUploader)(file?.filename, file?.path);
        response_helper_1.ResponseHelper.successResponse({
            res: res,
            statusCode: status_constants_1.HTTP_STATUS_OK,
            data: url?.url,
            message: "Successfully uploaded file",
        });
    }
    catch (error) {
        response_helper_1.ResponseHelper.httpErrorResponse(error?.message || error, status_constants_1.HTTP_STATUS_BAD_REQUEST);
    }
};
exports.default = uploader;
