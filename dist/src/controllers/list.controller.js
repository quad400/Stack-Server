"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListController = void 0;
const list_dao_1 = require("../dao/list.dao");
const response_helper_1 = require("../utils/helpers/response.helper");
const status_constants_1 = require("../constants/status.constants");
class ListController {
    constructor() {
        this.listDao = new list_dao_1.ListDao();
        this.create = async (req, res) => {
            const body = req.body;
            const userId = req.user._id;
            const { workspaceId, boardId } = req.query;
            const list = await this.listDao.create(body, userId, boardId, workspaceId);
            response_helper_1.ResponseHelper.successResponse({
                res,
                statusCode: status_constants_1.HTTP_STATUS_CREATED,
                data: list,
            });
        };
        this.list = async (req, res) => {
            const { boardId } = req.query;
            const lists = await this.listDao.list(boardId);
            response_helper_1.ResponseHelper.successResponse({
                res,
                statusCode: status_constants_1.HTTP_STATUS_OK,
                data: lists,
            });
        };
        this.get = async (req, res) => {
            const { listId } = req.params;
            const list = await this.listDao.get(listId);
            response_helper_1.ResponseHelper.successResponse({
                res,
                statusCode: status_constants_1.HTTP_STATUS_OK,
                data: list,
            });
        };
        this.update = async (req, res) => {
            const body = req.body;
            const { _id: userId } = req.user;
            const { listId } = req.params;
            const { workspaceId } = req.query;
            const list = await this.listDao.update(listId, workspaceId, body, userId);
            response_helper_1.ResponseHelper.successResponse({
                res,
                message: "Successfully updated board",
                statusCode: status_constants_1.HTTP_STATUS_OK,
                data: list,
            });
        };
        this.delete = async (req, res) => {
            const { workspaceId, boardId } = req.query;
            const { _id: userId } = req.user;
            const { listId } = req.params;
            await this.listDao.delete(boardId, listId, workspaceId, userId);
            response_helper_1.ResponseHelper.successResponse({
                res,
                message: "Successfully deleted board",
                statusCode: status_constants_1.HTTP_STATUS_OK,
            });
        };
        this.reorder = async (req, res) => {
            const userId = req.user?._id;
            const { workspaceId, boardId } = req.query;
            const lists = req.body;
            const dao = await this.listDao.reorder(boardId, workspaceId, userId, lists);
            response_helper_1.ResponseHelper.successResponse({
                res: res,
                message: "Successfully reorder list",
                statusCode: status_constants_1.HTTP_STATUS_OK,
                data: dao,
            });
        };
    }
}
exports.ListController = ListController;
