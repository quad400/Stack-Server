"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const member_dao_1 = require("../dao/member.dao");
const response_helper_1 = require("../utils/helpers/response.helper");
const status_constants_1 = require("../constants/status.constants");
const member_service_1 = require("../services/member.service");
class MemberController {
    constructor() {
        this.memberDao = new member_dao_1.MemberDao();
        this.memberService = new member_service_1.MemberService();
        this.lists = async (req, res) => {
            const { workspaceId } = req.query;
            const members = await this.memberDao.list(workspaceId);
            response_helper_1.ResponseHelper.successResponse({
                res: res,
                data: members,
                statusCode: status_constants_1.HTTP_STATUS_OK,
            });
        };
        this.inviteMember = async (req, res) => {
            const body = req.body;
            const userId = req.user._id;
            const { workspaceId } = req.query;
            await this.memberService.sendInvite(body, userId, workspaceId);
            response_helper_1.ResponseHelper.successResponse({
                res: res,
                message: "Invitation to workspace sent successfully",
                statusCode: status_constants_1.HTTP_STATUS_OK,
            });
        };
        this.acceptInvite = async (req, res) => {
            const { inviteCode } = req.params;
            const userId = req.user._id;
            await this.memberDao.acceptInvite(inviteCode, userId);
            response_helper_1.ResponseHelper.successResponse({
                res: res,
                message: "Invitation accepted successfully",
                statusCode: status_constants_1.HTTP_STATUS_OK,
            });
        };
    }
}
exports.default = MemberController;
