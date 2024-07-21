"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberService = void 0;
const member_dao_1 = require("../dao/member.dao");
const email_helper_1 = __importDefault(require("../utils/helpers/email.helper"));
class MemberService {
    constructor() {
        this.emailService = new email_helper_1.default();
        this.memberDao = new member_dao_1.MemberDao();
    }
    async sendInvite(body, userId, workspaceId) {
        const { fromUser, workspace } = await this.memberDao.sendInvite(body, userId, workspaceId);
        await this.emailService.sendEmail({
            to: body.email,
            subject: `${fromUser?.fullName} invited you to their project on stack`,
            template: "invitation",
            context: { inviteCode: workspace.inviteCode },
        });
    }
}
exports.MemberService = MemberService;
