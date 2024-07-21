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
exports.MemberService = void 0;
const member_dao_1 = require("../dao/member.dao");
const email_helper_1 = __importDefault(require("../utils/helpers/email.helper"));
class MemberService {
    constructor() {
        this.emailService = new email_helper_1.default();
        this.memberDao = new member_dao_1.MemberDao();
    }
    sendInvite(body, userId, workspaceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fromUser, workspace } = yield this.memberDao.sendInvite(body, userId, workspaceId);
            yield this.emailService.sendEmail({
                to: body.email,
                subject: `${fromUser === null || fromUser === void 0 ? void 0 : fromUser.fullName} invited you to their project on stack`,
                template: "invitation",
                context: { inviteCode: workspace.inviteCode },
            });
        });
    }
}
exports.MemberService = MemberService;
