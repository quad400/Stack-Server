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
exports.WorkspaceDao = void 0;
const status_constants_1 = require("../constants/status.constants");
const uuid_1 = require("uuid");
const member_model_1 = require("../models/member.model");
const workspace_model_1 = require("../models/workspace.model");
const database_exception_1 = require("../utils/exceptions/database.exception");
const dao_helper_1 = require("../utils/helpers/dao.helper");
const permissions_helper_1 = require("../utils/helpers/permissions.helper");
const response_helper_1 = require("../utils/helpers/response.helper");
class WorkspaceDao {
    constructor() {
        this.daoHelper = new dao_helper_1.DaoHelper();
        this.permissions = new permissions_helper_1.Permission();
    }
    create(body, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId) {
                response_helper_1.ResponseHelper.httpErrorResponse("Unauthorized", status_constants_1.HTTP_STATUS_UNAUTHORIZED);
            }
            const inviteCode = (0, uuid_1.v4)();
            const workspace = yield workspace_model_1.Workspace.create(Object.assign({ createdBy: userId, inviteCode }, body));
            const member = yield member_model_1.Member.create({
                user: userId,
                role: "admin",
                workspaceId: workspace._id,
            });
            workspace.members.push(member);
            yield workspace.save();
            return workspace;
        });
    }
    get(workspaceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const workspace = yield workspace_model_1.Workspace.findById(workspaceId)
                .populate("boards")
                .populate("members")
                .populate("members.user");
            if (!workspace) {
                throw new database_exception_1.DatabaseException(database_exception_1.ExceptionCodes.NOT_FOUND, "Workspace not found");
            }
            return workspace;
        });
    }
    list(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let workspaces;
            const members = yield member_model_1.Member.find({ user: userId });
            if (members.length > 0) {
                workspaces = yield workspace_model_1.Workspace.find({
                    _id: { $in: members.map((member) => member.workspaceId) },
                }).populate("boards");
            }
            return workspaces || [];
        });
    }
    update(body, workspaceId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.permissions.hasPermission(workspaceId, userId);
            const workspace = (yield this.daoHelper.update(workspace_model_1.Workspace, workspaceId, body)).populate("boards");
            return workspace;
        });
    }
    delete(userId, workspaceId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.permissions.hasPermission(workspaceId, userId);
            const workspace = yield this.daoHelper.getById(workspace_model_1.Workspace, workspaceId);
            const boards = yield workspace_model_1.Board.find({ workspaceId: workspaceId });
            boards.map((board) => __awaiter(this, void 0, void 0, function* () {
                yield board.deleteOne();
                const lists = yield workspace_model_1.List.find({ boardId: board._id });
                lists.map((list) => __awaiter(this, void 0, void 0, function* () {
                    yield list.deleteOne();
                    const cards = yield workspace_model_1.Card.find({ listId: list._id });
                    cards.map((card) => __awaiter(this, void 0, void 0, function* () {
                        yield card.deleteOne();
                    }));
                }));
            }));
            yield member_model_1.Member.deleteMany({ workspaceId: workspaceId });
            yield workspace.deleteOne();
        });
    }
    regenerateInviteCode(workspaceId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.permissions.IsAdmin(workspaceId, userId);
            const inviteCode = (0, uuid_1.v4)();
            const workspace = yield this.daoHelper.update(workspace_model_1.Workspace, workspaceId, {
                inviteCode,
            });
            return workspace;
        });
    }
}
exports.WorkspaceDao = WorkspaceDao;
