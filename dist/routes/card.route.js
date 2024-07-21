"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cardRoutes = void 0;
const express_1 = require("express");
const validators_helper_1 = require("../utils/helpers/validators.helper");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const workspace_dto_1 = require("../dto/workspace.dto");
const exception_middleware_1 = require("../middlewares/exception.middleware");
const card_controller_1 = require("../controllers/card.controller");
exports.cardRoutes = (0, express_1.Router)();
const cardController = new card_controller_1.CardController();
exports.cardRoutes.use(auth_middleware_1.protect);
exports.cardRoutes.post("/", (0, validators_helper_1.validator)({ dto: new workspace_dto_1.CreateListDto() }), (0, exception_middleware_1.exceptionEscalator)(cardController.create));
exports.cardRoutes.post("/reorder", (0, exception_middleware_1.exceptionEscalator)(cardController.reorder));
exports.cardRoutes.get("/", (0, exception_middleware_1.exceptionEscalator)(cardController.list));
exports.cardRoutes.get("/:cardId", (0, exception_middleware_1.exceptionEscalator)(cardController.get));
exports.cardRoutes.patch("/:cardId", (0, exception_middleware_1.exceptionEscalator)(cardController.update));
exports.cardRoutes.delete("/:cardId", (0, exception_middleware_1.exceptionEscalator)(cardController.delete));