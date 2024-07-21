"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageUploader = void 0;
const cloudinary_1 = require("cloudinary");
const response_helper_1 = require("../utils/helpers/response.helper");
const status_constants_1 = require("../constants/status.constants");
const imageUploader = async (name, picture) => {
    try {
        const uploader = await cloudinary_1.v2.uploader.upload(picture, {
            public_id: name,
            folder: "Stack",
        });
        return uploader;
    }
    catch (error) {
        response_helper_1.ResponseHelper.httpErrorResponse(error?.message || error, status_constants_1.HTTP_STATUS_BAD_REQUEST);
    }
};
exports.imageUploader = imageUploader;
