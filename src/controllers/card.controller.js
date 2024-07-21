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
exports.CardController = void 0;
const card_dao_1 = require("../dao/card.dao");
const response_helper_1 = require("../utils/helpers/response.helper");
const status_constants_1 = require("../constants/status.constants");
class CardController {
    constructor() {
        this.cardDao = new card_dao_1.CardDao();
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const userId = req.user._id;
            const { workspaceId, listId } = req.query;
            const card = yield this.cardDao.create(body, userId, listId, workspaceId);
            response_helper_1.ResponseHelper.successResponse({
                res,
                statusCode: status_constants_1.HTTP_STATUS_CREATED,
                data: card,
            });
        });
        this.list = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const query = req.query;
            const { listId } = req.query;
            const cards = yield this.cardDao.list(listId, query);
            response_helper_1.ResponseHelper.successResponse({
                res,
                statusCode: status_constants_1.HTTP_STATUS_OK,
                data: cards,
            });
        });
        this.get = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { cardId } = req.params;
            const card = yield this.cardDao.get(cardId);
            response_helper_1.ResponseHelper.successResponse({
                res,
                statusCode: status_constants_1.HTTP_STATUS_OK,
                data: card,
            });
        });
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const { _id: userId } = req.user;
            const { cardId } = req.params;
            const { workspaceId } = req.query;
            const card = yield this.cardDao.update(cardId, workspaceId, body, userId);
            response_helper_1.ResponseHelper.successResponse({
                res,
                message: "Successfully updated board",
                statusCode: status_constants_1.HTTP_STATUS_OK,
                data: card,
            });
        });
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { workspaceId, listId } = req.query;
            const { _id: userId } = req.user;
            const { cardId } = req.params;
            yield this.cardDao.delete(cardId, listId, workspaceId, userId);
            response_helper_1.ResponseHelper.successResponse({
                res,
                message: "Successfully deleted board",
                statusCode: status_constants_1.HTTP_STATUS_OK,
            });
        });
        this.reorder = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
            const { workspaceId } = req.query;
            const lists = req.body;
            const dao = yield this.cardDao.reorder(workspaceId, userId, lists);
            response_helper_1.ResponseHelper.successResponse({
                res: res,
                message: "Successfully reorder card",
                statusCode: status_constants_1.HTTP_STATUS_OK,
                data: dao,
            });
        });
    }
}
exports.CardController = CardController;
