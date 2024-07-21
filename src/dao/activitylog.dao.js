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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityLogDao = void 0;
const activitylog_model_1 = __importDefault(require("../models/activitylog.model"));
class ActivityLogDao {
    create(body, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const activityLog = yield activitylog_model_1.default.create(Object.assign({ user: userId }, body));
            return activityLog;
        });
    }
    list(workspaceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const activityLogs = yield activitylog_model_1.default.find({
                workspaceId: workspaceId,
            }).populate({ path: "user", select: "fullName email" });
            return activityLogs;
        });
    }
}
exports.ActivityLogDao = ActivityLogDao;
