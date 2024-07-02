import { v4 as uuidV4 } from "uuid";

import { Workspace } from "../models/workspace.model";
import { DaoHelper } from "../utils/helpers/dao.helper";
import { Permission } from "../utils/helpers/permissions.helper";
import { Member } from "../models/member.model";
import { OrganizationMembership } from "@clerk/clerk-sdk-node";
import { IUser } from "../interfaces/user.interface";

export class MemberDao {
  private daoHelper = new DaoHelper();
  private permission = new Permission();

  async regenerateInviteCodeDao(workspaceId: string, userId: string) {
    await this.permission.IsAdmin(workspaceId, userId);

    const inviteCode = uuidV4();
    console.log(inviteCode);
    const workspace = await this.daoHelper.update(Workspace, workspaceId, {
      inviteCode: inviteCode,
    });

    return workspace;
  }

  async list(workspaceId: string) {
    const members = await Member.find({ workspaceId: workspaceId });

    return members;
  }

  async update(memberId: string, data: Record<string, any>) {
    const member = await this.daoHelper.getById(Member, memberId);
    const { workspaceId, user } = member;
    await this.permission.IsAdmin(workspaceId.toString(), user.toString());

    await member.updateOne(data);
    return member;
  }

  async delete(memberId: string) {
    const member = await this.daoHelper.getById(Member, memberId);
    const { workspaceId ,user} = member;
    
    await this.permission.IsAdmin(workspaceId.toString(), user.toString());
    
    await this.daoHelper.update(
      Workspace,
      workspaceId.toString(),
      { members: { $pull: member._id } }
    );

    await member.deleteOne();
  }

}
