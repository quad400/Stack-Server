"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberDao = void 0;
const workspace_model_1 = require("../models/workspace.model");
const dao_helper_1 = require("../utils/helpers/dao.helper");
const permissions_helper_1 = require("../utils/helpers/permissions.helper");
const member_model_1 = require("../models/member.model");
const user_model_1 = __importDefault(require("../models/user.model"));
class MemberDao {
    constructor() {
        this.daoHelper = new dao_helper_1.DaoHelper();
        this.permission = new permissions_helper_1.Permission();
    }
    async list(workspaceId) {
        const members = await member_model_1.Member.find({ workspaceId: workspaceId }).populate("user", "fullName email avatar");
        return members;
    }
    async update(memberId, data) {
        const member = await this.daoHelper.getById(member_model_1.Member, memberId);
        const { workspaceId, user } = member;
        await this.permission.IsAdmin(workspaceId.toString(), user.toString());
        await member.updateOne(data);
        return member;
    }
    async delete(memberId) {
        const member = await this.daoHelper.getById(member_model_1.Member, memberId);
        const { workspaceId, user } = member;
        await this.permission.IsAdmin(workspaceId.toString(), user.toString());
        await this.daoHelper.update(workspace_model_1.Workspace, workspaceId.toString(), {
            members: { $pull: member._id },
        });
        await member.deleteOne();
    }
    async sendInvite(body, userId, workspaceId) {
        const { email } = body;
        const user = await user_model_1.default.findOne({ email });
        const fromUser = await this.daoHelper.getByData(user_model_1.default, { _id: userId });
        if (user) {
            await this.daoHelper.duplicate(member_model_1.Member, {
                user: user._id,
                workspaceId: workspaceId,
            });
        }
        const workspace = await this.daoHelper.getById(workspace_model_1.Workspace, workspaceId);
        return { fromUser, workspace };
    }
    async acceptInvite(inviteCode, userId) {
        const workspace = await this.daoHelper.getByData(workspace_model_1.Workspace, { inviteCode });
        const user = await this.daoHelper.getById(user_model_1.default, userId);
        await this.daoHelper.duplicate(member_model_1.Member, {
            user: user._id,
            workspaceId: workspace._id,
        });
        const member = await member_model_1.Member.create({
            user: user._id,
            workspaceId: workspace._id,
        });
        workspace.members.push(member);
        await workspace.save();
    }
}
exports.MemberDao = MemberDao;
