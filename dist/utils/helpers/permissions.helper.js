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
exports.Permission = void 0;
const dao_helper_1 = require("./dao.helper");
const database_exception_1 = require("../exceptions/database.exception");
const member_model_1 = require("../../models/member.model");
class Permission {
    constructor() {
        this.daoHelper = new dao_helper_1.DaoHelper();
    }
    hasPermission(modelId, ownerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const member = (yield member_model_1.Member.findOne({
                workspaceId: modelId,
                user: ownerId,
            }));
            if (!member) {
                throw new database_exception_1.DatabaseException(database_exception_1.ExceptionCodes.PERMISSION_DENIED, "Permission denied");
            }
            return true;
        });
    }
    IsAdmin(modelId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const member = (yield member_model_1.Member.findOne({
                workspaceId: modelId,
                user: userId,
                role: "admin",
            }));
            if (!member) {
                throw new database_exception_1.DatabaseException(database_exception_1.ExceptionCodes.PERMISSION_DENIED, "Permission denied");
            }
            return true;
        });
    }
}
exports.Permission = Permission;
