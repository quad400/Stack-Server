"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Permission = void 0;
const dao_helper_1 = require("./dao.helper");
const database_exception_1 = require("../exceptions/database.exception");
const member_model_1 = require("../../models/member.model");
class Permission {
    constructor() {
        this.daoHelper = new dao_helper_1.DaoHelper();
    }
    async hasPermission(modelId, ownerId) {
        const member = (await member_model_1.Member.findOne({
            workspaceId: modelId,
            user: ownerId,
        }));
        if (!member) {
            throw new database_exception_1.DatabaseException(database_exception_1.ExceptionCodes.PERMISSION_DENIED, "Permission denied");
        }
        return true;
    }
    async IsAdmin(modelId, userId) {
        const member = (await member_model_1.Member.findOne({
            workspaceId: modelId,
            user: userId,
            role: "admin",
        }));
        if (!member) {
            throw new database_exception_1.DatabaseException(database_exception_1.ExceptionCodes.PERMISSION_DENIED, "Permission denied");
        }
        return true;
    }
}
exports.Permission = Permission;
