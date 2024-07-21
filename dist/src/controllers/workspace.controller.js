"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceController = void 0;
const workspace_dao_1 = require("../dao/workspace.dao");
const response_helper_1 = require("../utils/helpers/response.helper");
const status_constants_1 = require("../constants/status.constants");
class WorkspaceController {
    constructor() {
        this.workspaceDao = new workspace_dao_1.WorkspaceDao();
        this.create = async (req, res) => {
            const body = req.body;
            const userId = req.user;
            const workspace = await this.workspaceDao.create(body, userId);
            response_helper_1.ResponseHelper.successResponse({
                res: res,
                message: "Successfully created workspace",
                data: workspace,
                statusCode: status_constants_1.HTTP_STATUS_CREATED,
            });
        };
        this.get = async (req, res) => {
            const { workspaceId } = req.params;
            const workspace = await this.workspaceDao.get(workspaceId);
            response_helper_1.ResponseHelper.successResponse({
                res: res,
                data: workspace,
                statusCode: status_constants_1.HTTP_STATUS_OK,
            });
        };
        this.list = async (req, res) => {
            const userId = req.user;
            const workspace = await this.workspaceDao.list(userId);
            response_helper_1.ResponseHelper.successResponse({
                res: res,
                data: workspace,
                statusCode: status_constants_1.HTTP_STATUS_OK,
            });
        };
        this.update = async (req, res) => {
            const userId = req.user?._id;
            const body = req.body;
            const { workspaceId } = req.params;
            console.log(body);
            const workspace = await this.workspaceDao.update(body, workspaceId, userId);
            response_helper_1.ResponseHelper.successResponse({
                res: res,
                data: workspace,
                statusCode: status_constants_1.HTTP_STATUS_OK,
            });
        };
        this.delete = async (req, res) => {
            const userId = req.user?._id;
            const { workspaceId } = req.params;
            await this.workspaceDao.delete(userId, workspaceId);
            response_helper_1.ResponseHelper.successResponse({
                res: res,
                message: "Successfully deleted workspace",
                statusCode: status_constants_1.HTTP_STATUS_OK,
            });
        };
        this.regenerate = async (req, res) => {
            const userId = req.user?._id;
            const { workspaceId } = req.params;
            const workspace = await this.workspaceDao.regenerateInviteCode(workspaceId, userId);
            response_helper_1.ResponseHelper.successResponse({
                res: res,
                message: "Successfully regenerate invite code",
                data: workspace,
                statusCode: status_constants_1.HTTP_STATUS_OK,
            });
        };
    }
}
exports.WorkspaceController = WorkspaceController;
