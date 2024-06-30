import { ICreateList } from "../interfaces/workspace.interface";
import { Board, List, Workspace } from "../models/workspace.model";
import { DaoHelper } from "../utils/helpers/dao.helper";
import { Permission } from "../utils/helpers/permissions.helper";

export class ListDao {
  private dao = new DaoHelper();
  private permission = new Permission();

  async create(
    body: ICreateList,
    userId: string,
    boardId: any,
    workspaceId: any
  ) {
    await this.permission.isOwnerPermission(Workspace, workspaceId, userId);

    const list = await List.create({ boardId: boardId, ...body });

    await this.dao.update(Board, boardId, { $push: { lists: list } });

    return list;
  }

  async get(listId: string) {
    const list = await this.dao.getById(List, listId);

    return list;
  }

  async list(boardId: any, query: any) {
    const lists = await this.dao.getAll({
      model: List,
      query: query,
      paginated: false,
      optionalQuery: { boardId: boardId },
    });

    return lists;
  }

  async update(
    listId: string,
    workspaceId: any,
    body: Record<string, any>,
    userId: string
  ) {
    await this.permission.isOwnerPermission(Workspace, workspaceId, userId);

    const list = await this.dao.update(List, listId, body);

    return list;
  }

  async delete(boardId: any, listId: string, workspaceId: any, userId: string) {
    await this.permission.isOwnerPermission(Workspace, workspaceId, userId);

    await this.dao.update(Board, boardId, {
      $pull: { lists: listId },
    });

    await List.findByIdAndDelete(listId);
  }
}
