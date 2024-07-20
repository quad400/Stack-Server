import { v4 as uuidV4 } from "uuid";

import { Workspace } from "../models/workspace.model";
import { DaoHelper } from "../utils/helpers/dao.helper";
import { Permission } from "../utils/helpers/permissions.helper";
import { Member } from "../models/member.model";
import { OrganizationMembership } from "@clerk/clerk-sdk-node";
import { IUser } from "../interfaces/user.interface";
import User from "../models/user.model";

export class MemberDao {
  private daoHelper = new DaoHelper();
  private permission = new Permission();

  async list(workspaceId: string) {
    const members = await Member.find({ workspaceId: workspaceId }).populate(
      "user",
      "fullName email avatar"
    );

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
    const { workspaceId, user } = member;

    await this.permission.IsAdmin(workspaceId.toString(), user.toString());

    await this.daoHelper.update(Workspace, workspaceId.toString(), {
      members: { $pull: member._id },
    });

    await member.deleteOne();
  }

  async sendInvite(
    body: Record<string, string>,
    userId: string,
    workspaceId: string
  ) {
    const { email } = body;
    const user = await User.findOne({ email });
    const fromUser = await this.daoHelper.getByData(User, { _id: userId });

    if (user) {
      await this.daoHelper.duplicate(Member, {
        user: user._id,
        workspaceId: workspaceId,
      });
    }

    const workspace = await this.daoHelper.getById(Workspace, workspaceId);

    return { fromUser, workspace };
  }

  async acceptInvite(inviteCode: string, userId: string) {
    const workspace = await this.daoHelper.getByData(Workspace, { inviteCode });
    const user = await this.daoHelper.getById(User, userId);

    await this.daoHelper.duplicate(Member, {
      user: user._id,
      workspaceId: workspace._id,
    });

    const member = await Member.create({
      user: user._id,
      workspaceId: workspace._id,
    });

    workspace.members.push(member);
    await workspace.save();
  }
}
