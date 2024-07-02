import { ICreateList } from "../interfaces/workspace.interface";
import { Board, Card, List, Workspace } from "../models/workspace.model";
import { DaoHelper } from "../utils/helpers/dao.helper";
import { Permission } from "../utils/helpers/permissions.helper";

export class CardDao {
  private dao = new DaoHelper();
  private permission = new Permission();

  async create(
    body: ICreateList,
    userId: string,
    listId: any,
    workspaceId: any
  ) {
    await this.permission.hasPermission(workspaceId, userId);

    const card = await Card.create({ listId: listId, ...body });

    await this.dao.update(List, listId, { $push: { cards: card } });
    return card;
  }

  async get(cardId: string) {
    const list = await this.dao.getById(Card, cardId);

    return list;
  }

  async list(listId: any, query: any) {
    const cards = await this.dao.getAll({
      model: Card,
      query: query,
      paginated: false,
      optionalQuery: { listId: listId },
    });

    return cards;
  }

  async update(
    cardId: string,
    workspaceId: any,
    body: Record<string, any>,
    userId: string
  ) {
    await this.permission.hasPermission(workspaceId, userId);

    const card = await this.dao.update(Card, cardId, body);

    return card;
  }

  async delete(cardId: string, listId: any, workspaceId: any, userId: string) {
    await this.permission.hasPermission(workspaceId, userId);

    await this.dao.update(List, listId, {
      $pull: { cards: cardId },
    });

    await Card.findByIdAndDelete(cardId);
  }
}
