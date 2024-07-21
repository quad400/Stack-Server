"use strict";
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
    async create(body, userId) {
        if (!userId) {
            response_helper_1.ResponseHelper.httpErrorResponse("Unauthorized", status_constants_1.HTTP_STATUS_UNAUTHORIZED);
        }
        const inviteCode = (0, uuid_1.v4)();
        const workspace = await workspace_model_1.Workspace.create({
            createdBy: userId,
            inviteCode,
            ...body,
        });
        const member = await member_model_1.Member.create({
            user: userId,
            role: "admin",
            workspaceId: workspace._id,
        });
        workspace.members.push(member);
        await workspace.save();
        return workspace;
    }
    async get(workspaceId) {
        const workspace = await workspace_model_1.Workspace.findById(workspaceId)
            .populate("boards")
            .populate("members")
            .populate("members.user");
        if (!workspace) {
            throw new database_exception_1.DatabaseException(database_exception_1.ExceptionCodes.NOT_FOUND, "Workspace not found");
        }
        return workspace;
    }
    async list(userId) {
        let workspaces;
        const members = await member_model_1.Member.find({ user: userId });
        if (members.length > 0) {
            workspaces = await workspace_model_1.Workspace.find({
                _id: { $in: members.map((member) => member.workspaceId) },
            }).populate("boards");
        }
        return workspaces || [];
    }
    async update(body, workspaceId, userId) {
        await this.permissions.hasPermission(workspaceId, userId);
        const workspace = (await this.daoHelper.update(workspace_model_1.Workspace, workspaceId, body)).populate("boards");
        return workspace;
    }
    async delete(userId, workspaceId) {
        await this.permissions.hasPermission(workspaceId, userId);
        const workspace = await this.daoHelper.getById(workspace_model_1.Workspace, workspaceId);
        const boards = await workspace_model_1.Board.find({ workspaceId: workspaceId });
        boards.map(async (board) => {
            await board.deleteOne();
            const lists = await workspace_model_1.List.find({ boardId: board._id });
            lists.map(async (list) => {
                await list.deleteOne();
                const cards = await workspace_model_1.Card.find({ listId: list._id });
                cards.map(async (card) => {
                    await card.deleteOne();
                });
            });
        });
        await member_model_1.Member.deleteMany({ workspaceId: workspaceId });
        await workspace.deleteOne();
    }
    async regenerateInviteCode(workspaceId, userId) {
        await this.permissions.IsAdmin(workspaceId, userId);
        const inviteCode = (0, uuid_1.v4)();
        const workspace = await this.daoHelper.update(workspace_model_1.Workspace, workspaceId, {
            inviteCode,
        });
        return workspace;
    }
}
exports.WorkspaceDao = WorkspaceDao;
