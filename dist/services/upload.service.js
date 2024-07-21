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
exports.imageUploader = void 0;
const cloudinary_1 = require("cloudinary");
const response_helper_1 = require("../utils/helpers/response.helper");
const status_constants_1 = require("../constants/status.constants");
const imageUploader = (name, picture) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uploader = yield cloudinary_1.v2.uploader.upload(picture, {
            public_id: name,
            folder: "Stack",
        });
        return uploader;
    }
    catch (error) {
        response_helper_1.ResponseHelper.httpErrorResponse((error === null || error === void 0 ? void 0 : error.message) || error, status_constants_1.HTTP_STATUS_BAD_REQUEST);
    }
});
exports.imageUploader = imageUploader;
