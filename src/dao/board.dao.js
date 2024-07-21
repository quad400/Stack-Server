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
exports.BoardDao = void 0;
const workspace_interface_1 = require("../interfaces/workspace.interface");
const workspace_model_1 = require("../models/workspace.model");
const database_exception_1 = require("../utils/exceptions/database.exception");
const dao_helper_1 = require("../utils/helpers/dao.helper");
const permissions_helper_1 = require("../utils/helpers/permissions.helper");
const activitylog_dao_1 = require("./activitylog.dao");
class BoardDao {
    constructor() {
        this.dao = new dao_helper_1.DaoHelper();
        this.permission = new permissions_helper_1.Permission();
        this.activityLogDao = new activitylog_dao_1.ActivityLogDao();
    }
    create(body, userId, workspaceId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.permission.hasPermission(workspaceId, userId);
            const board = yield workspace_model_1.Board.create(Object.assign({ workspaceId: workspaceId }, body));
            const workspace = yield this.dao.getById(workspace_model_1.Workspace, workspaceId);
            workspace.boards.push(board);
            yield workspace.save();
            yield this.activityLogDao.create({
                action: workspace_interface_1.ACTION.CREATE,
                entityType: workspace_interface_1.ENTITY_TYPE.BOARD,
                entityTitle: board.name,
                workspaceId: workspaceId,
            }, userId);
            return board;
        });
    }
    get(boardId) {
        return __awaiter(this, void 0, void 0, function* () {
            const board = yield workspace_model_1.Board.findById(boardId)
                .populate("lists")
                .populate("lists.cards")
                .exec();
            if (!board) {
                throw new database_exception_1.DatabaseException(database_exception_1.ExceptionCodes.NOT_FOUND, `Board not found`);
            }
            return board;
        });
    }
    list(workspaceId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const workspaces = yield this.dao.getAll({
                model: workspace_model_1.Board,
                query: query,
                paginated: false,
                optionalQuery: { workspaceId: workspaceId },
            });
            return workspaces;
        });
    }
    update(boardId, workspaceId, body, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.permission.hasPermission(workspaceId, userId);
            const board = yield this.dao.update(workspace_model_1.Board, boardId, body);
            yield this.activityLogDao.create({
                action: workspace_interface_1.ACTION.UPDATE,
                entityType: workspace_interface_1.ENTITY_TYPE.BOARD,
                entityTitle: board.name,
                workspaceId: workspaceId,
            }, userId);
            return board;
        });
    }
    delete(boardId, workspaceId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.permission.hasPermission(workspaceId, userId);
            yield this.dao.update(workspace_model_1.Workspace, workspaceId, {
                $pull: { boards: boardId },
            });
            const board = yield this.dao.getByData(workspace_model_1.Board, { workspaceId: workspaceId });
            const lists = yield workspace_model_1.List.find({ boardId: board._id });
            lists.map((list) => __awaiter(this, void 0, void 0, function* () {
                yield list.deleteOne();
                const cards = yield workspace_model_1.Card.find({ listId: list._id });
                cards.map((card) => __awaiter(this, void 0, void 0, function* () {
                    yield card.deleteOne();
                }));
            }));
            yield this.activityLogDao.create({
                action: workspace_interface_1.ACTION.UPDATE,
                entityType: workspace_interface_1.ENTITY_TYPE.LIST,
                entityTitle: board.name,
                workspaceId: workspaceId,
            }, userId);
            yield board.deleteOne();
        });
    }
    search(query) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(query);
            const boards = yield workspace_model_1.Board.find({ name: query });
            return boards;
        });
    }
}
exports.BoardDao = BoardDao;
