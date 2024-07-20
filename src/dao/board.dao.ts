import {
  ACTION,
  ENTITY_TYPE,
  ICreateBoard,
} from "../interfaces/workspace.interface";
import { Board, Card, List, Workspace } from "../models/workspace.model";
import {
  DatabaseException,
  ExceptionCodes,
} from "../utils/exceptions/database.exception";
import { DaoHelper } from "../utils/helpers/dao.helper";
import { Permission } from "../utils/helpers/permissions.helper";
import { ActivityLogDao } from "./activitylog.dao";

export class BoardDao {
  private dao = new DaoHelper();
  private permission = new Permission();
  private activityLogDao = new ActivityLogDao();

  async create(body: ICreateBoard, userId: string, workspaceId: any) {
    await this.permission.hasPermission(workspaceId, userId);
    const board = await Board.create({ workspaceId: workspaceId, ...body });

    const workspace = await this.dao.getById(Workspace, workspaceId);
    workspace.boards.push(board);
    await workspace.save();

    await this.activityLogDao.create(
      {
        action: ACTION.CREATE,
        entityType: ENTITY_TYPE.BOARD,
        entityTitle: board.name,
        workspaceId: workspaceId as any,
      },
      userId
    );

    return board;
  }

  async get(boardId: string) {
    const board = await Board.findById(boardId)
      .populate("lists")
      .populate("lists.cards")
      .exec();
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
    await this.permission.hasPermission(workspaceId, userId);

    const board = await this.dao.update(Board, boardId, body);

    await this.activityLogDao.create(
      {
        action: ACTION.UPDATE,
        entityType: ENTITY_TYPE.BOARD,
        entityTitle: board.name,
        workspaceId: workspaceId as any,
      },
      userId
    );
    return board;
  }

  async delete(boardId: string, workspaceId: any, userId: string) {
    await this.permission.hasPermission(workspaceId, userId);

    await this.dao.update(Workspace, workspaceId, {
      $pull: { boards: boardId },
    });

    const board = await this.dao.getByData(Board, { workspaceId: workspaceId });

    const lists = await List.find({ boardId: board._id });
    lists.map(async (list) => {
      await list.deleteOne();

      const cards = await Card.find({ listId: list._id });
      cards.map(async (card) => {
        await card.deleteOne();
      });
    });

    await this.activityLogDao.create(
      {
        action: ACTION.UPDATE,
        entityType: ENTITY_TYPE.LIST,
        entityTitle: board.name,
        workspaceId: workspaceId as any,
      },
      userId
    );

    await board.deleteOne();
  }

  async search(query: any) {
    console.log(query);
    const boards = await Board.find({name: query});

    return boards;
  }
}
