import { HTTP_STATUS_UNAUTHORIZED } from "../constants/status.constants";
import {
  ICreateWorkspace,
  IWorkspace,
} from "../interfaces/workspace.interface";
import { Member } from "../models/member.model";
import { Workspace } from "../models/workspace.model";
import {
  DatabaseException,
  ExceptionCodes,
} from "../utils/exceptions/database.exception";
import { DaoHelper } from "../utils/helpers/dao.helper";
import { Permission } from "../utils/helpers/permissions.helper";
import { ResponseHelper } from "../utils/helpers/response.helper";

export class WorkspaceDao {
  private daoHelper = new DaoHelper();

  private permissions = new Permission();

  async create(body: ICreateWorkspace, userId: string) {
    if (!userId) {
      ResponseHelper.httpErrorResponse(
        "Unauthorized",
        HTTP_STATUS_UNAUTHORIZED
      );
    }

    const workspace = await Workspace.create({ createdBy: userId, ...body });
    const member = await Member.create({
      user: userId,
      role: "admin",
      workspaceId: workspace._id,
    });
    workspace.members.push(member);
    await workspace.save();

    return workspace;
  }

  async get(workspaceId: string) {
    const workspace = (await this.daoHelper.getById(Workspace, workspaceId)).populate("boards");

    return workspace;
  }

  async list(userId: string) {
    const workspace = await Workspace.find({ createdBy: userId }).populate({
      path: "boards",
    });

    return workspace;
  }

  async update(body: IWorkspace, workspaceId: string, userId: string) {
    await this.permissions.hasPermission(workspaceId, userId);

    const workspace = (await this.daoHelper.update(Workspace, workspaceId, body)).populate("boards");

    return workspace;
  }

  async delete(userId: string, workspaceId: string) {
    await this.permissions.hasPermission(workspaceId, userId);

    const workspace = await Workspace.findByIdAndDelete(workspaceId);

    if (!workspace) {
      throw new DatabaseException(
        ExceptionCodes.NOT_FOUND,
        "Workspace not found"
      );
    }

    // await workspace.remove()
  }
}
