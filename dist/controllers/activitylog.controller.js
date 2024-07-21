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
exports.ActivityLogController = void 0;
const activitylog_dao_1 = require("../dao/activitylog.dao");
const response_helper_1 = require("../utils/helpers/response.helper");
const status_constants_1 = require("../constants/status.constants");
class ActivityLogController {
    constructor() {
        this.activityLogDao = new activitylog_dao_1.ActivityLogDao();
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const userId = req.user._id;
            const activityLog = yield this.activityLogDao.create(body, userId);
            response_helper_1.ResponseHelper.successResponse({
                res,
                message: "Successfully created activity log",
                data: activityLog,
                statusCode: status_constants_1.HTTP_STATUS_CREATED,
            });
        });
        this.list = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { workspaceId } = req.query;
            const activityLogs = yield this.activityLogDao.list(workspaceId);
            response_helper_1.ResponseHelper.successResponse({
                res,
                statusCode: status_constants_1.HTTP_STATUS_OK,
                data: activityLogs,
            });
        });
    }
}
exports.ActivityLogController = ActivityLogController;
