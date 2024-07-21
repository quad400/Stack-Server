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
exports.BoardController = void 0;
const board_dao_1 = require("../dao/board.dao");
const response_helper_1 = require("../utils/helpers/response.helper");
const status_constants_1 = require("../constants/status.constants");
const activitylog_dao_1 = require("../dao/activitylog.dao");
class BoardController {
    constructor() {
        this.boardDao = new board_dao_1.BoardDao();
        this.activityLogDao = new activitylog_dao_1.ActivityLogDao();
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const userId = req.user._id;
            const { workspaceId } = req.query;
            const board = yield this.boardDao.create(body, userId, workspaceId);
            response_helper_1.ResponseHelper.successResponse({
                res,
                statusCode: status_constants_1.HTTP_STATUS_CREATED,
                data: board,
            });
        });
        this.list = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const query = req.query;
            const { workspaceId } = req.query;
            const boards = yield this.boardDao.list(workspaceId, query);
            response_helper_1.ResponseHelper.successResponse({
                res,
                statusCode: status_constants_1.HTTP_STATUS_OK,
                data: boards,
            });
        });
        this.get = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { boardId } = req.params;
            const body = req.body;
            const board = yield this.boardDao.get(boardId);
            response_helper_1.ResponseHelper.successResponse({
                res,
                statusCode: status_constants_1.HTTP_STATUS_OK,
                data: board,
            });
        });
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const { _id: userId } = req.user;
            const { boardId } = req.params;
            const { workspaceId } = req.query;
            const board = yield this.boardDao.update(boardId, workspaceId, body, userId);
            response_helper_1.ResponseHelper.successResponse({
                res,
                message: "Successfully updated board",
                statusCode: status_constants_1.HTTP_STATUS_OK,
                data: board,
            });
        });
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { workspaceId } = req.query;
            const { _id: userId } = req.user;
            const { boardId } = req.params;
            yield this.boardDao.delete(boardId, workspaceId, userId);
            response_helper_1.ResponseHelper.successResponse({
                res,
                message: "Successfully deleted board",
                statusCode: status_constants_1.HTTP_STATUS_OK,
            });
        });
        this.search = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { q } = req.query;
            const boards = yield this.boardDao.search(q);
            response_helper_1.ResponseHelper.successResponse({
                res,
                statusCode: status_constants_1.HTTP_STATUS_OK,
                data: boards,
            });
        });
    }
}
exports.BoardController = BoardController;
