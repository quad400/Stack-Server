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
    create(body, userId, listId, workspaceId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.permission.hasPermission(workspaceId, userId);
            const card = yield workspace_model_1.Card.create(Object.assign({ listId: listId }, body));
            yield this.dao.update(workspace_model_1.List, listId, { $push: { cards: card } });
            yield this.activityLogDao.create({
                action: workspace_interface_1.ACTION.CREATE,
                entityType: workspace_interface_1.ENTITY_TYPE.CARD,
                entityTitle: card.name,
                workspaceId: workspaceId,
            }, userId);
            return card;
        });
    }
    get(cardId) {
        return __awaiter(this, void 0, void 0, function* () {
            const list = yield this.dao.getById(workspace_model_1.Card, cardId);
            return list;
        });
    }
    list(listId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const cards = yield this.dao.getAll({
                model: workspace_model_1.Card,
                query: query,
                paginated: false,
                optionalQuery: { listId: listId },
            });
            return cards;
        });
    }
    update(cardId, workspaceId, body, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.permission.hasPermission(workspaceId, userId);
            const card = yield this.dao.update(workspace_model_1.Card, cardId, body);
            yield this.activityLogDao.create({
                action: workspace_interface_1.ACTION.UPDATE,
                entityType: workspace_interface_1.ENTITY_TYPE.CARD,
                workspaceId: workspaceId,
                entityTitle: card.name,
            }, userId);
            return card;
        });
    }
    delete(cardId, listId, workspaceId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.permission.hasPermission(workspaceId, userId);
            yield this.dao.update(workspace_model_1.List, listId, {
                $pull: { cards: cardId },
            });
            const card = yield this.dao.getById(workspace_model_1.Card, cardId);
            yield this.activityLogDao.create({
                action: workspace_interface_1.ACTION.UPDATE,
                entityType: workspace_interface_1.ENTITY_TYPE.LIST,
                entityTitle: card.name,
                workspaceId: workspaceId,
            }, userId);
            yield card.deleteOne();
        });
    }
    reorder(workspaceId, userId, lists) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.permission.hasPermission(workspaceId, userId);
            for (const list of lists) {
                for (const card of list.cards) {
                    // Update the order of the card
                    yield workspace_model_1.Card.updateOne({ _id: card._id }, { $set: { order: card.order } });
                }
                // Retrieve the updated cards and replace the cards array in the list
                const updatedCards = yield workspace_model_1.Card.find({
                    _id: {
                        $in: list.cards.map((card) => card._id),
                    },
                }).sort("order");
                yield workspace_model_1.List.updateOne({ _id: list._id }, { $set: { cards: updatedCards.map((card) => card._id) } });
            }
            // Retrieve the updated lists and sort by order
            const updatedLists = yield workspace_model_1.List.find({ boardId: lists[0].boardId })
                .sort("order")
                .populate("cards");
            return updatedLists;
        });
    }
}
exports.CardDao = CardDao;
