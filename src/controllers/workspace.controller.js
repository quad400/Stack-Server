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
exports.WorkspaceController = void 0;
const workspace_dao_1 = require("../dao/workspace.dao");
const response_helper_1 = require("../utils/helpers/response.helper");
const status_constants_1 = require("../constants/status.constants");
class WorkspaceController {
    constructor() {
        this.workspaceDao = new workspace_dao_1.WorkspaceDao();
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const userId = req.user;
            const workspace = yield this.workspaceDao.create(body, userId);
            response_helper_1.ResponseHelper.successResponse({
                res: res,
                message: "Successfully created workspace",
                data: workspace,
                statusCode: status_constants_1.HTTP_STATUS_CREATED,
            });
        });
        this.get = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { workspaceId } = req.params;
            const workspace = yield this.workspaceDao.get(workspaceId);
            response_helper_1.ResponseHelper.successResponse({
                res: res,
                data: workspace,
                statusCode: status_constants_1.HTTP_STATUS_OK,
            });
        });
        this.list = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.user;
            const workspace = yield this.workspaceDao.list(userId);
            response_helper_1.ResponseHelper.successResponse({
                res: res,
                data: workspace,
                statusCode: status_constants_1.HTTP_STATUS_OK,
            });
        });
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
            const body = req.body;
            const { workspaceId } = req.params;
            console.log(body);
            const workspace = yield this.workspaceDao.update(body, workspaceId, userId);
            response_helper_1.ResponseHelper.successResponse({
                res: res,
                data: workspace,
                statusCode: status_constants_1.HTTP_STATUS_OK,
            });
        });
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _b;
            const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b._id;
            const { workspaceId } = req.params;
            yield this.workspaceDao.delete(userId, workspaceId);
            response_helper_1.ResponseHelper.successResponse({
                res: res,
                message: "Successfully deleted workspace",
                statusCode: status_constants_1.HTTP_STATUS_OK,
            });
        });
        this.regenerate = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _c;
            const userId = (_c = req.user) === null || _c === void 0 ? void 0 : _c._id;
            const { workspaceId } = req.params;
            const workspace = yield this.workspaceDao.regenerateInviteCode(workspaceId, userId);
            response_helper_1.ResponseHelper.successResponse({
                res: res,
                message: "Successfully regenerate invite code",
                data: workspace,
                statusCode: status_constants_1.HTTP_STATUS_OK,
            });
        });
    }
}
exports.WorkspaceController = WorkspaceController;
