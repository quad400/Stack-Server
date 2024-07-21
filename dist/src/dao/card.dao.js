"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardDao = void 0;
const workspace_interface_1 = require("../interfaces/workspace.interface");
const workspace_model_1 = require("../models/workspace.model");
const dao_helper_1 = require("../utils/helpers/dao.helper");
const permissions_helper_1 = require("../utils/helpers/permissions.helper");
const activitylog_dao_1 = require("./activitylog.dao");
class CardDao {
    constructor() {
        this.dao = new dao_helper_1.DaoHelper();
        this.permission = new permissions_helper_1.Permission();
        this.activityLogDao = new activitylog_dao_1.ActivityLogDao();
    }
    async create(body, userId, listId, workspaceId) {
        await this.permission.hasPermission(workspaceId, userId);
        const card = await workspace_model_1.Card.create({ listId: listId, ...body });
        await this.dao.update(workspace_model_1.List, listId, { $push: { cards: card } });
        await this.activityLogDao.create({
            action: workspace_interface_1.ACTION.CREATE,
            entityType: workspace_interface_1.ENTITY_TYPE.CARD,
            entityTitle: card.name,
            workspaceId: workspaceId,
        }, userId);
        return card;
    }
    async get(cardId) {
        const list = await this.dao.getById(workspace_model_1.Card, cardId);
        return list;
    }
    async list(listId, query) {
        const cards = await this.dao.getAll({
            model: workspace_model_1.Card,
            query: query,
            paginated: false,
            optionalQuery: { listId: listId },
        });
        return cards;
    }
    async update(cardId, workspaceId, body, userId) {
        await this.permission.hasPermission(workspaceId, userId);
        const card = await this.dao.update(workspace_model_1.Card, cardId, body);
        await this.activityLogDao.create({
            action: workspace_interface_1.ACTION.UPDATE,
            entityType: workspace_interface_1.ENTITY_TYPE.CARD,
            workspaceId: workspaceId,
            entityTitle: card.name,
        }, userId);
        return card;
    }
    async delete(cardId, listId, workspaceId, userId) {
        await this.permission.hasPermission(workspaceId, userId);
        await this.dao.update(workspace_model_1.List, listId, {
            $pull: { cards: cardId },
        });
        const card = await this.dao.getById(workspace_model_1.Card, cardId);
        await this.activityLogDao.create({
            action: workspace_interface_1.ACTION.UPDATE,
            entityType: workspace_interface_1.ENTITY_TYPE.LIST,
            entityTitle: card.name,
            workspaceId: workspaceId,
        }, userId);
        await card.deleteOne();
    }
    async reorder(workspaceId, userId, lists) {
        await this.permission.hasPermission(workspaceId, userId);
        for (const list of lists) {
            for (const card of list.cards) {
                // Update the order of the card
                await workspace_model_1.Card.updateOne({ _id: card._id }, { $set: { order: card.order } });
            }
            // Retrieve the updated cards and replace the cards array in the list
            const updatedCards = await workspace_model_1.Card.find({
                _id: {
                    $in: list.cards.map((card) => card._id),
                },
            }).sort("order");
            await workspace_model_1.List.updateOne({ _id: list._id }, { $set: { cards: updatedCards.map((card) => card._id) } });
        }
        // Retrieve the updated lists and sort by order
        const updatedLists = await workspace_model_1.List.find({ boardId: lists[0].boardId })
            .sort("order")
            .populate("cards");
        return updatedLists;
    }
}
exports.CardDao = CardDao;
