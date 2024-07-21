"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardController = void 0;
const card_dao_1 = require("../dao/card.dao");
const response_helper_1 = require("../utils/helpers/response.helper");
const status_constants_1 = require("../constants/status.constants");
class CardController {
    constructor() {
        this.cardDao = new card_dao_1.CardDao();
        this.create = async (req, res) => {
            const body = req.body;
            const userId = req.user._id;
            const { workspaceId, listId } = req.query;
            const card = await this.cardDao.create(body, userId, listId, workspaceId);
            response_helper_1.ResponseHelper.successResponse({
                res,
                statusCode: status_constants_1.HTTP_STATUS_CREATED,
                data: card,
            });
        };
        this.list = async (req, res) => {
            const query = req.query;
            const { listId } = req.query;
            const cards = await this.cardDao.list(listId, query);
            response_helper_1.ResponseHelper.successResponse({
                res,
                statusCode: status_constants_1.HTTP_STATUS_OK,
                data: cards,
            });
        };
        this.get = async (req, res) => {
            const { cardId } = req.params;
            const card = await this.cardDao.get(cardId);
            response_helper_1.ResponseHelper.successResponse({
                res,
                statusCode: status_constants_1.HTTP_STATUS_OK,
                data: card,
            });
        };
        this.update = async (req, res) => {
            const body = req.body;
            const { _id: userId } = req.user;
            const { cardId } = req.params;
            const { workspaceId } = req.query;
            const card = await this.cardDao.update(cardId, workspaceId, body, userId);
            response_helper_1.ResponseHelper.successResponse({
                res,
                message: "Successfully updated board",
                statusCode: status_constants_1.HTTP_STATUS_OK,
                data: card,
            });
        };
        this.delete = async (req, res) => {
            const { workspaceId, listId } = req.query;
            const { _id: userId } = req.user;
            const { cardId } = req.params;
            await this.cardDao.delete(cardId, listId, workspaceId, userId);
            response_helper_1.ResponseHelper.successResponse({
                res,
                message: "Successfully deleted board",
                statusCode: status_constants_1.HTTP_STATUS_OK,
            });
        };
        this.reorder = async (req, res) => {
            const userId = req.user?._id;
            const { workspaceId } = req.query;
            const lists = req.body;
            const dao = await this.cardDao.reorder(workspaceId, userId, lists);
            response_helper_1.ResponseHelper.successResponse({
                res: res,
                message: "Successfully reorder card",
                statusCode: status_constants_1.HTTP_STATUS_OK,
                data: dao,
            });
        };
    }
}
exports.CardController = CardController;
