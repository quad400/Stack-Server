import { Request, Response } from "express";
import { MemberDao } from "../dao/member.dao";
import { ResponseHelper } from "../utils/helpers/response.helper";
import { HTTP_STATUS_OK } from "../constants/status.constants";
import { MemberService } from "../services/member.service";

class MemberController {
  private memberDao = new MemberDao();
  private memberService = new MemberService();

  lists = async (req: Request, res: Response) => {
    const { workspaceId } = req.query;

    const members = await this.memberDao.list(workspaceId as string);
    ResponseHelper.successResponse({
      res: res,
      data: members,
      statusCode: HTTP_STATUS_OK,
    });
  };

  inviteMember = async (req: Request, res: Response) => {
    const body = req.body;
    const userId = req.user._id;
    const { workspaceId } = req.query;

    await this.memberService.sendInvite(body, userId, workspaceId as string);
    ResponseHelper.successResponse({
      res: res,
      message: "Invitation to workspace sent successfully",
      statusCode: HTTP_STATUS_OK,
    });
  };

  acceptInvite = async (req: Request, res: Response) => {
    const { inviteCode } = req.params;
    const userId = req.user._id;

    await this.memberDao.acceptInvite(inviteCode, userId);
    ResponseHelper.successResponse({
      res: res,
      message: "Invitation accepted successfully",
      statusCode: HTTP_STATUS_OK,
    });
  }
}

export default MemberController;
