"use strict";
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
    async create(body, userId, workspaceId) {
        await this.permission.hasPermission(workspaceId, userId);
        const board = await workspace_model_1.Board.create({ workspaceId: workspaceId, ...body });
        const workspace = await this.dao.getById(workspace_model_1.Workspace, workspaceId);
        workspace.boards.push(board);
        await workspace.save();
        await this.activityLogDao.create({
            action: workspace_interface_1.ACTION.CREATE,
            entityType: workspace_interface_1.ENTITY_TYPE.BOARD,
            entityTitle: board.name,
            workspaceId: workspaceId,
        }, userId);
        return board;
    }
    async get(boardId) {
        const board = await workspace_model_1.Board.findById(boardId)
            .populate("lists")
            .populate("lists.cards")
            .exec();
        if (!board) {
            throw new database_exception_1.DatabaseException(database_exception_1.ExceptionCodes.NOT_FOUND, `Board not found`);
        }
        return board;
    }
    async list(workspaceId, query) {
        const workspaces = await this.dao.getAll({
            model: workspace_model_1.Board,
            query: query,
            paginated: false,
            optionalQuery: { workspaceId: workspaceId },
        });
        return workspaces;
    }
    async update(boardId, workspaceId, body, userId) {
        await this.permission.hasPermission(workspaceId, userId);
        const board = await this.dao.update(workspace_model_1.Board, boardId, body);
        await this.activityLogDao.create({
            action: workspace_interface_1.ACTION.UPDATE,
            entityType: workspace_interface_1.ENTITY_TYPE.BOARD,
            entityTitle: board.name,
            workspaceId: workspaceId,
        }, userId);
        return board;
    }
    async delete(boardId, workspaceId, userId) {
        await this.permission.hasPermission(workspaceId, userId);
        await this.dao.update(workspace_model_1.Workspace, workspaceId, {
            $pull: { boards: boardId },
        });
        const board = await this.dao.getByData(workspace_model_1.Board, { workspaceId: workspaceId });
        const lists = await workspace_model_1.List.find({ boardId: board._id });
        lists.map(async (list) => {
            await list.deleteOne();
            const cards = await workspace_model_1.Card.find({ listId: list._id });
            cards.map(async (card) => {
                await card.deleteOne();
            });
        });
        await this.activityLogDao.create({
            action: workspace_interface_1.ACTION.UPDATE,
            entityType: workspace_interface_1.ENTITY_TYPE.LIST,
            entityTitle: board.name,
            workspaceId: workspaceId,
        }, userId);
        await board.deleteOne();
    }
    async search(query) {
        console.log(query);
        const boards = await workspace_model_1.Board.find({ name: query });
        return boards;
    }
}
exports.BoardDao = BoardDao;
