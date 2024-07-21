"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityLogDao = void 0;
const activitylog_model_1 = __importDefault(require("../models/activitylog.model"));
class ActivityLogDao {
    async create(body, userId) {
        const activityLog = await activitylog_model_1.default.create({
            user: userId,
            ...body,
        });
        return activityLog;
    }
    async list(workspaceId) {
        const activityLogs = await activitylog_model_1.default.find({
            workspaceId: workspaceId,
        }).populate({ path: "user", select: "fullName email" });
        return activityLogs;
    }
}
exports.ActivityLogDao = ActivityLogDao;
