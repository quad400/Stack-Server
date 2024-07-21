"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityLogController = void 0;
const activitylog_dao_1 = require("../dao/activitylog.dao");
const response_helper_1 = require("../utils/helpers/response.helper");
const status_constants_1 = require("../constants/status.constants");
class ActivityLogController {
    constructor() {
        this.activityLogDao = new activitylog_dao_1.ActivityLogDao();
        this.create = async (req, res) => {
            const body = req.body;
            const userId = req.user._id;
            const activityLog = await this.activityLogDao.create(body, userId);
            response_helper_1.ResponseHelper.successResponse({
                res,
                message: "Successfully created activity log",
                data: activityLog,
                statusCode: status_constants_1.HTTP_STATUS_CREATED,
            });
        };
        this.list = async (req, res) => {
            const { workspaceId } = req.query;
            const activityLogs = await this.activityLogDao.list(workspaceId);
            response_helper_1.ResponseHelper.successResponse({
                res,
                statusCode: status_constants_1.HTTP_STATUS_OK,
                data: activityLogs,
            });
        };
    }
}
exports.ActivityLogController = ActivityLogController;
