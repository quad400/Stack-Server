"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordDto = exports.LoginDto = exports.EmailDto = exports.RegisterDto = void 0;
const class_validator_1 = require("class-validator");
class RegisterDto {
}
exports.RegisterDto = RegisterDto;
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)()
], RegisterDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)()
], RegisterDto.prototype, "fullName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(6),
    (0, class_validator_1.Matches)(/^(?=.*\d|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).{6,}$/, {
        message: "Password must be at least 6 characters long, and include uppercase, lowercase, and either a digit or a special character.",
    })
], RegisterDto.prototype, "password", void 0);
class EmailDto {
}
exports.EmailDto = EmailDto;
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)()
], EmailDto.prototype, "email", void 0);
class LoginDto {
}
exports.LoginDto = LoginDto;
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)()
], LoginDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(6),
    (0, class_validator_1.Matches)(/^(?=.*\d|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).{6,}$/, {
        message: "Password must be at least 6 characters long, and include uppercase, lowercase, and either a digit or a special character.",
    })
], LoginDto.prototype, "password", void 0);
class ResetPasswordDto {
}
exports.ResetPasswordDto = ResetPasswordDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(6),
    (0, class_validator_1.Matches)(/^(?=.*\d|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).{6,}$/, {
        message: "Password must be at least 6 characters long, and include uppercase, lowercase, and either a digit or a special character.",
    })
], ResetPasswordDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(6),
    (0, class_validator_1.Matches)(/^(?=.*\d|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).{6,}$/, {
        message: "Password must be at least 6 characters long, and include uppercase, lowercase, and either a digit or a special character.",
    })
], ResetPasswordDto.prototype, "confirmPassword", void 0);
