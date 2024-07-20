import { HTTP_STATUS_UNAUTHORIZED } from "../constants/status.constants";
import { v4 as uuidv4 } from "uuid";
import {
  ICreateWorkspace,
  IWorkspace,
} from "../interfaces/workspace.interface";
import { Member } from "../models/member.model";
import { Board, Card, List, Workspace } from "../models/workspace.model";
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

    const inviteCode = uuidv4();
    const workspace = await Workspace.create({
      createdBy: userId,
      inviteCode,
      ...body,
    });
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
    const workspace = await Workspace.findById(workspaceId)
      .populate("boards")
      .populate("members")
      .populate("members.user");

    if (!workspace) {
      throw new DatabaseException(
        ExceptionCodes.NOT_FOUND,
        "Workspace not found"
      );
    }

    return workspace;
  }

  async list(userId: string) {

  let workspaces
  
  const members = await Member.find({ user: userId });

  if (members.length > 0) {
    workspaces = await Workspace.find({
      _id: { $in: members.map((member) => member.workspaceId) },
    }).populate("boards");
  }

    return workspaces || [];
  }

  async update(body: IWorkspace, workspaceId: string, userId: string) {
    await this.permissions.hasPermission(workspaceId, userId);

    const workspace = (
      await this.daoHelper.update(Workspace, workspaceId, body)
    ).populate("boards");

    return workspace;
  }

  async delete(userId: string, workspaceId: string) {
    await this.permissions.hasPermission(workspaceId, userId);

    const workspace = await this.daoHelper.getById(Workspace, workspaceId);
    const boards = await Board.find({ workspaceId: workspaceId });

    boards.map(async (board) => {
      await board.deleteOne();
      const lists = await List.find({ boardId: board._id });
      lists.map(async (list) => {
        await list.deleteOne();

        const cards = await Card.find({ listId: list._id });
        cards.map(async (card) => {
          await card.deleteOne();
        });
      });
    });

    await Member.deleteMany({ workspaceId: workspaceId });
    await workspace.deleteOne();
  }

  async regenerateInviteCode(workspaceId: string, userId: string) {
    await this.permissions.IsAdmin(workspaceId, userId);

    const inviteCode = uuidv4();
    const workspace = await this.daoHelper.update(Workspace, workspaceId, {
      inviteCode,
    });

    return workspace;
  }
}
