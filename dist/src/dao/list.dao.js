"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListDao = void 0;
const workspace_interface_1 = require("../interfaces/workspace.interface");
const workspace_model_1 = require("../models/workspace.model");
const dao_helper_1 = require("../utils/helpers/dao.helper");
const permissions_helper_1 = require("../utils/helpers/permissions.helper");
const activitylog_dao_1 = require("./activitylog.dao");
class ListDao {
    constructor() {
        this.dao = new dao_helper_1.DaoHelper();
        this.permission = new permissions_helper_1.Permission();
        this.activityLogDao = new activitylog_dao_1.ActivityLogDao();
    }
    async create(body, userId, boardId, workspaceId) {
        await this.permission.hasPermission(workspaceId, userId);
        const highestOrderCard = await workspace_model_1.List.findOne({ boardId: boardId }).sort("-order");
        const order = highestOrderCard ? highestOrderCard.order + 1 : 0;
        const list = await workspace_model_1.List.create({ boardId: boardId, order: order, ...body });
        await this.dao.update(workspace_model_1.Board, boardId, { $push: { lists: list } });
        await this.activityLogDao.create({
            action: workspace_interface_1.ACTION.CREATE,
            entityType: workspace_interface_1.ENTITY_TYPE.LIST,
            entityTitle: list.name,
            workspaceId: workspaceId,
        }, userId);
        return list;
    }
    async get(listId) {
        const list = await workspace_model_1.List.findById(listId).populate("cards");
        console.log(list);
        return list;
    }
    async list(boardId) {
        const lists = await workspace_model_1.List.find({ boardId: boardId })
            .populate("cards")
            .sort({ order: 1 });
        return lists;
    }
    async update(listId, workspaceId, body, userId) {
        await this.permission.hasPermission(workspaceId, userId);
        const list = await this.dao.update(workspace_model_1.List, listId, body);
        await this.activityLogDao.create({
            action: workspace_interface_1.ACTION.UPDATE,
            entityType: workspace_interface_1.ENTITY_TYPE.LIST,
            entityTitle: list.name,
            workspaceId: workspaceId,
        }, userId);
        return list;
    }
    async delete(boardId, listId, workspaceId, userId) {
        await this.permission.hasPermission(workspaceId, userId);
        await this.dao.update(workspace_model_1.Board, boardId, {
            $pull: { lists: listId },
        });
        const list = await this.dao.getByData(workspace_model_1.List, { boardId: boardId });
        const cards = await workspace_model_1.Card.find({ listId: list._id });
        cards.map(async (card) => {
            await card.deleteOne();
        });
        await this.activityLogDao.create({
            action: workspace_interface_1.ACTION.UPDATE,
            entityType: workspace_interface_1.ENTITY_TYPE.LIST,
            entityTitle: list.name,
            workspaceId: workspaceId,
        }, userId);
        await list.deleteOne();
    }
    async reorder(boardId, workspaceId, userId, lists) {
        await this.permission.hasPermission(workspaceId, userId);
        for (const list of lists) {
            await workspace_model_1.List.updateOne({ _id: list._id, boardId }, { $set: { order: list.order } });
        }
        const updatedLists = await workspace_model_1.List.find({ boardId }).sort("order");
        return updatedLists;
    }
}
exports.ListDao = ListDao;
