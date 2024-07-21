"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.memberRoutes = void 0;
const express_1 = require("express");
const member_controller_1 = __importDefault(require("../controllers/member.controller"));
const exception_middleware_1 = require("../middlewares/exception.middleware");
const auth_middleware_1 = require("../middlewares/auth.middleware");
exports.memberRoutes = (0, express_1.Router)();
const memberController = new member_controller_1.default();
exports.memberRoutes.get("/", (0, exception_middleware_1.exceptionEscalator)(memberController.lists));
exports.memberRoutes.use(auth_middleware_1.protect);
exports.memberRoutes.post("/invite", (0, exception_middleware_1.exceptionEscalator)(memberController.inviteMember));
exports.memberRoutes.post("/accept/:inviteCode", (0, exception_middleware_1.exceptionEscalator)(memberController.acceptInvite));
