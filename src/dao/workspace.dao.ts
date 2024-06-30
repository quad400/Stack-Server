import { HTTP_STATUS_UNAUTHORIZED } from "../constants/status.constants";
import {
  ICreateWorkspace,
  IWorkspace,
} from "../interfaces/workspace.interface";
import { Workspace } from "../models/workspace.model";
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

    return workspace;
  }

  async list(userId: string) {
    const workspace = await this.daoHelper.getAll({
      model: Workspace,
      query: { createdBy: userId },
    });

    return workspace;
  }

  async update(body: IWorkspace, workspaceId: string, userId: string) {
    await this.permissions.isOwnerPermission(Workspace, workspaceId, userId);

    const workspace = await this.daoHelper.update(Workspace, workspaceId, body);

    return workspace;
  }

  async delete(userId: string, workspaceId: string) {
    await this.permissions.isOwnerPermission(Workspace, workspaceId, userId);

    await Workspace.findByIdAndDelete(workspaceId);
  }
}
