import { MemberDao } from "../dao/member.dao";
import { IUser } from "../interfaces/user.interface";
import EmailService from "../utils/helpers/email.helper";

export class MemberService {
  private emailService = new EmailService();

  private memberDao = new MemberDao();

  async sendInvite(
    body: Record<string, string>,
    userId: string,
    workspaceId: string
  ) {
    const { fromUser, workspace } = await this.memberDao.sendInvite(
      body,
      userId,
      workspaceId
    );

    await this.emailService.sendEmail({
      to: body.email,
      subject: `${fromUser?.fullName} invited you to their project on stack`,
      template: "invitation",
      context: { inviteCode: workspace.inviteCode },
    });
  }
}
