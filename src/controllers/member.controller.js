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
const member_dao_1 = require("../dao/member.dao");
const response_helper_1 = require("../utils/helpers/response.helper");
const status_constants_1 = require("../constants/status.constants");
const member_service_1 = require("../services/member.service");
class MemberController {
    constructor() {
        this.memberDao = new member_dao_1.MemberDao();
        this.memberService = new member_service_1.MemberService();
        this.lists = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { workspaceId } = req.query;
            const members = yield this.memberDao.list(workspaceId);
            response_helper_1.ResponseHelper.successResponse({
                res: res,
                data: members,
                statusCode: status_constants_1.HTTP_STATUS_OK,
            });
        });
        this.inviteMember = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const userId = req.user._id;
            const { workspaceId } = req.query;
            yield this.memberService.sendInvite(body, userId, workspaceId);
            response_helper_1.ResponseHelper.successResponse({
                res: res,
                message: "Invitation to workspace sent successfully",
                statusCode: status_constants_1.HTTP_STATUS_OK,
            });
        });
        this.acceptInvite = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { inviteCode } = req.params;
            const userId = req.user._id;
            yield this.memberDao.acceptInvite(inviteCode, userId);
            response_helper_1.ResponseHelper.successResponse({
                res: res,
                message: "Invitation accepted successfully",
                statusCode: status_constants_1.HTTP_STATUS_OK,
            });
        });
    }
}
exports.default = MemberController;
