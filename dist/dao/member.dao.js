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
    list(workspaceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const members = yield member_model_1.Member.find({ workspaceId: workspaceId }).populate("user", "fullName email avatar");
            return members;
        });
    }
    update(memberId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const member = yield this.daoHelper.getById(member_model_1.Member, memberId);
            const { workspaceId, user } = member;
            yield this.permission.IsAdmin(workspaceId.toString(), user.toString());
            yield member.updateOne(data);
            return member;
        });
    }
    delete(memberId) {
        return __awaiter(this, void 0, void 0, function* () {
            const member = yield this.daoHelper.getById(member_model_1.Member, memberId);
            const { workspaceId, user } = member;
            yield this.permission.IsAdmin(workspaceId.toString(), user.toString());
            yield this.daoHelper.update(workspace_model_1.Workspace, workspaceId.toString(), {
                members: { $pull: member._id },
            });
            yield member.deleteOne();
        });
    }
    sendInvite(body, userId, workspaceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = body;
            const user = yield user_model_1.default.findOne({ email });
            const fromUser = yield this.daoHelper.getByData(user_model_1.default, { _id: userId });
            if (user) {
                yield this.daoHelper.duplicate(member_model_1.Member, {
                    user: user._id,
                    workspaceId: workspaceId,
                });
            }
            const workspace = yield this.daoHelper.getById(workspace_model_1.Workspace, workspaceId);
            return { fromUser, workspace };
        });
    }
    acceptInvite(inviteCode, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const workspace = yield this.daoHelper.getByData(workspace_model_1.Workspace, { inviteCode });
            const user = yield this.daoHelper.getById(user_model_1.default, userId);
            yield this.daoHelper.duplicate(member_model_1.Member, {
                user: user._id,
                workspaceId: workspace._id,
            });
            const member = yield member_model_1.Member.create({
                user: user._id,
                workspaceId: workspace._id,
            });
            workspace.members.push(member);
            yield workspace.save();
        });
    }
}
exports.MemberDao = MemberDao;
