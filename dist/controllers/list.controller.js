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
exports.ListController = void 0;
const list_dao_1 = require("../dao/list.dao");
const response_helper_1 = require("../utils/helpers/response.helper");
const status_constants_1 = require("../constants/status.constants");
const activitylog_dao_1 = require("../dao/activitylog.dao");
class ListController {
    constructor() {
        this.listDao = new list_dao_1.ListDao();
        this.activityLogDao = new activitylog_dao_1.ActivityLogDao();
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const userId = req.user._id;
            const { workspaceId, boardId } = req.query;
            const list = yield this.listDao.create(body, userId, boardId, workspaceId);
            response_helper_1.ResponseHelper.successResponse({
                res,
                statusCode: status_constants_1.HTTP_STATUS_CREATED,
                data: list,
            });
        });
        this.list = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { boardId } = req.query;
            const lists = yield this.listDao.list(boardId);
            response_helper_1.ResponseHelper.successResponse({
                res,
                statusCode: status_constants_1.HTTP_STATUS_OK,
                data: lists,
            });
        });
        this.get = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { listId } = req.params;
            const list = yield this.listDao.get(listId);
            response_helper_1.ResponseHelper.successResponse({
                res,
                statusCode: status_constants_1.HTTP_STATUS_OK,
                data: list,
            });
        });
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const { _id: userId } = req.user;
            const { listId } = req.params;
            const { workspaceId, boardId } = req.query;
            const list = yield this.listDao.update(listId, workspaceId, body, userId);
            response_helper_1.ResponseHelper.successResponse({
                res,
                message: "Successfully updated board",
                statusCode: status_constants_1.HTTP_STATUS_OK,
                data: list,
            });
        });
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { workspaceId, boardId } = req.query;
            const { _id: userId } = req.user;
            const { listId } = req.params;
            yield this.listDao.delete(boardId, listId, workspaceId, userId);
            response_helper_1.ResponseHelper.successResponse({
                res,
                message: "Successfully deleted board",
                statusCode: status_constants_1.HTTP_STATUS_OK,
            });
        });
        this.reorder = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
            const { workspaceId, boardId } = req.query;
            const lists = req.body;
            const dao = yield this.listDao.reorder(boardId, workspaceId, userId, lists);
            response_helper_1.ResponseHelper.successResponse({
                res: res,
                message: "Successfully reorder list",
                statusCode: status_constants_1.HTTP_STATUS_OK,
                data: dao,
            });
        });
    }
}
exports.ListController = ListController;
