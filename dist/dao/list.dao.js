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
    create(body, userId, boardId, workspaceId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.permission.hasPermission(workspaceId, userId);
            const highestOrderCard = yield workspace_model_1.List.findOne({ boardId: boardId }).sort("-order");
            const order = highestOrderCard ? highestOrderCard.order + 1 : 0;
            const list = yield workspace_model_1.List.create(Object.assign({ boardId: boardId, order: order }, body));
            yield this.dao.update(workspace_model_1.Board, boardId, { $push: { lists: list } });
            yield this.activityLogDao.create({
                action: workspace_interface_1.ACTION.CREATE,
                entityType: workspace_interface_1.ENTITY_TYPE.LIST,
                entityTitle: list.name,
                workspaceId: workspaceId,
            }, userId);
            return list;
        });
    }
    get(listId) {
        return __awaiter(this, void 0, void 0, function* () {
            const list = yield workspace_model_1.List.findById(listId).populate("cards");
            console.log(list);
            return list;
        });
    }
    list(boardId) {
        return __awaiter(this, void 0, void 0, function* () {
            const lists = yield workspace_model_1.List.find({ boardId: boardId })
                .populate("cards")
                .sort({ order: 1 });
            return lists;
        });
    }
    update(listId, workspaceId, body, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.permission.hasPermission(workspaceId, userId);
            const list = yield this.dao.update(workspace_model_1.List, listId, body);
            yield this.activityLogDao.create({
                action: workspace_interface_1.ACTION.UPDATE,
                entityType: workspace_interface_1.ENTITY_TYPE.LIST,
                entityTitle: list.name,
                workspaceId: workspaceId,
            }, userId);
            return list;
        });
    }
    delete(boardId, listId, workspaceId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.permission.hasPermission(workspaceId, userId);
            yield this.dao.update(workspace_model_1.Board, boardId, {
                $pull: { lists: listId },
            });
            const list = yield this.dao.getByData(workspace_model_1.List, { boardId: boardId });
            const cards = yield workspace_model_1.Card.find({ listId: list._id });
            cards.map((card) => __awaiter(this, void 0, void 0, function* () {
                yield card.deleteOne();
            }));
            yield this.activityLogDao.create({
                action: workspace_interface_1.ACTION.UPDATE,
                entityType: workspace_interface_1.ENTITY_TYPE.LIST,
                entityTitle: list.name,
                workspaceId: workspaceId,
            }, userId);
            yield list.deleteOne();
        });
    }
    reorder(boardId, workspaceId, userId, lists) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.permission.hasPermission(workspaceId, userId);
            for (const list of lists) {
                yield workspace_model_1.List.updateOne({ _id: list._id, boardId }, { $set: { order: list.order } });
            }
            const updatedLists = yield workspace_model_1.List.find({ boardId }).sort("order");
            return updatedLists;
        });
    }
}
exports.ListDao = ListDao;
