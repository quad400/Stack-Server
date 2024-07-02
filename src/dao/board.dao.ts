import { ICreateBoard } from "../interfaces/workspace.interface";
import { Board, Workspace } from "../models/workspace.model";
import {
  DatabaseException,
  ExceptionCodes,
} from "../utils/exceptions/database.exception";
import { DaoHelper } from "../utils/helpers/dao.helper";
import { Permission } from "../utils/helpers/permissions.helper";

export class BoardDao {
  private dao = new DaoHelper();
  private permission = new Permission();

  async create(body: ICreateBoard, userId: string, workspaceId: any) {
    await this.permission.hasPermission(workspaceId, userId);
    const board = await Board.create({ workspaceId: workspaceId, ...body });

    const workspace = await this.dao.getById(Workspace, workspaceId);
    workspace.boards.push(board);
    await workspace.save();

    return board;
  }

  async get(boardId: string) {
    const board = await Board.findById(boardId).populate("lists");
    if (!board) {
      throw new DatabaseException(ExceptionCodes.NOT_FOUND, `Board not found`);
    }
    return board;
  }

  async list(workspaceId: any, query: any) {
    const workspaces = await this.dao.getAll({
      model: Board,
      query: query,
      paginated: false,
      optionalQuery: { workspaceId: workspaceId },
    });

    return workspaces;
  }

  async update(
    boardId: string,
    workspaceId: any,
    body: Record<string, any>,
    userId: string
  ) {
    console.log(workspaceId)
    await this.permission.hasPermission(workspaceId, userId);

    const board = await this.dao.update(Board, boardId, body);

    return board;
  }

  async delete(boardId: string, workspaceId: any, userId: string) {
    await this.permission.hasPermission(workspaceId, userId);

    await this.dao.update(Workspace, workspaceId, {
      $pull: { boards: boardId },
    });

    await Board.findByIdAndDelete(boardId);
  }
}
