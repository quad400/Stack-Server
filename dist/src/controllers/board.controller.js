"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoardController = void 0;
const board_dao_1 = require("../dao/board.dao");
const response_helper_1 = require("../utils/helpers/response.helper");
const status_constants_1 = require("../constants/status.constants");
const activitylog_dao_1 = require("../dao/activitylog.dao");
class BoardController {
    constructor() {
        this.boardDao = new board_dao_1.BoardDao();
        this.activityLogDao = new activitylog_dao_1.ActivityLogDao();
        this.create = async (req, res) => {
            const body = req.body;
            const userId = req.user._id;
            const { workspaceId } = req.query;
            const board = await this.boardDao.create(body, userId, workspaceId);
            response_helper_1.ResponseHelper.successResponse({
                res,
                statusCode: status_constants_1.HTTP_STATUS_CREATED,
                data: board,
            });
        };
        this.list = async (req, res) => {
            const query = req.query;
            const { workspaceId } = req.query;
            const boards = await this.boardDao.list(workspaceId, query);
            response_helper_1.ResponseHelper.successResponse({
                res,
                statusCode: status_constants_1.HTTP_STATUS_OK,
                data: boards,
            });
        };
        this.get = async (req, res) => {
            const { boardId } = req.params;
            const board = await this.boardDao.get(boardId);
            response_helper_1.ResponseHelper.successResponse({
                res,
                statusCode: status_constants_1.HTTP_STATUS_OK,
                data: board,
            });
        };
        this.update = async (req, res) => {
            const body = req.body;
            const { _id: userId } = req.user;
            const { boardId } = req.params;
            const { workspaceId } = req.query;
            const board = await this.boardDao.update(boardId, workspaceId, body, userId);
            response_helper_1.ResponseHelper.successResponse({
                res,
                message: "Successfully updated board",
                statusCode: status_constants_1.HTTP_STATUS_OK,
                data: board,
            });
        };
        this.delete = async (req, res) => {
            const { workspaceId } = req.query;
            const { _id: userId } = req.user;
            const { boardId } = req.params;
            await this.boardDao.delete(boardId, workspaceId, userId);
            response_helper_1.ResponseHelper.successResponse({
                res,
                message: "Successfully deleted board",
                statusCode: status_constants_1.HTTP_STATUS_OK,
            });
        };
        this.search = async (req, res) => {
            const { q } = req.query;
            const boards = await this.boardDao.search(q);
            response_helper_1.ResponseHelper.successResponse({
                res,
                statusCode: status_constants_1.HTTP_STATUS_OK,
                data: boards,
            });
        };
    }
}
exports.BoardController = BoardController;
