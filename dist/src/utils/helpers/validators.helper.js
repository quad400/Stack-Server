"use strict";
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
    return async function (req, res, next) {
        try {
            const body = req.body;
            const dto = options.dto;
            Object.keys(body).forEach((key) => {
                dto[key] = body[key];
            });
            await (0, class_validator_1.validateOrReject)(dto, {
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
    };
};
exports.validator = validator;
