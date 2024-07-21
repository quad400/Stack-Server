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
exports.validator = void 0;
const class_validator_1 = require("class-validator");
const status_constants_1 = require("../../constants/status.constants");
function formatValidatorError(errors) {
    return errors.map((error) => {
        return (error.property &&
            error.constraints && {
            [error.property]: Object.values(error.constraints),
        });
    });
}
const validator = (options) => {
    return function (req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const dto = options.dto;
                Object.keys(body).forEach((key) => {
                    dto[key] = body[key];
                });
                yield (0, class_validator_1.validateOrReject)(dto, {
                    validationError: { target: false },
                    forbidUnknownValues: true,
                });
            }
            catch (error) {
                return res
                    .status(status_constants_1.HTTP_STATUS_BAD_REQUEST)
                    .json(formatValidatorError(error));
            }
            next();
        });
    };
};
exports.validator = validator;
