"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_helper_1 = require("../utils/helpers/response.helper");
const status_constants_1 = require("../constants/status.constants");
const upload_service_1 = require("../services/upload.service");
/**
 * `POST` /api/upload
 * @param req image
 * @param res data
 */
const uploader = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    try {
        if (!file)
            response_helper_1.ResponseHelper.httpErrorResponse("Image file is required", status_constants_1.HTTP_STATUS_NO_CONTENT);
        const url = yield (0, upload_service_1.imageUploader)(file === null || file === void 0 ? void 0 : file.filename, file === null || file === void 0 ? void 0 : file.path);
        response_helper_1.ResponseHelper.successResponse({
            res: res,
            statusCode: status_constants_1.HTTP_STATUS_OK,
            data: url === null || url === void 0 ? void 0 : url.url,
            message: "Successfully uploaded file",
        });
    }
    catch (error) {
        response_helper_1.ResponseHelper.httpErrorResponse((error === null || error === void 0 ? void 0 : error.message) || error, status_constants_1.HTTP_STATUS_BAD_REQUEST);
    }
});
exports.default = uploader;
