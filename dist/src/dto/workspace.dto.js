"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateListDto = exports.CreateBoardDto = exports.CreateModelDto = void 0;
const class_validator_1 = require("class-validator");
class CreateModelDto {
}
exports.CreateModelDto = CreateModelDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)()
], CreateModelDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsUrl)()
], CreateModelDto.prototype, "image", void 0);
class CreateBoardDto {
}
exports.CreateBoardDto = CreateBoardDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)()
], CreateBoardDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsUrl)()
], CreateBoardDto.prototype, "image", void 0);
class CreateListDto {
}
exports.CreateListDto = CreateListDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)()
], CreateListDto.prototype, "name", void 0);
