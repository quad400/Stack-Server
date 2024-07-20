import mongoose from "mongoose";
import {
  ACTION,
  ENTITY_TYPE,
  ICreateList,
  IList,
} from "../interfaces/workspace.interface";
import { Board, Card, List, Workspace } from "../models/workspace.model";
import { DaoHelper } from "../utils/helpers/dao.helper";
import { Permission } from "../utils/helpers/permissions.helper";
import { Types } from "mongoose";
import { ActivityLogDao } from "./activitylog.dao";

export class CardDao {
  private dao = new DaoHelper();
  private permission = new Permission();
  private activityLogDao = new ActivityLogDao();

  async create(
    body: ICreateList,
    userId: string,
    listId: any,
    workspaceId: any
  ) {
    await this.permission.hasPermission(workspaceId, userId);

    const card = await Card.create({ listId: listId, ...body });

    await this.dao.update(List, listId, { $push: { cards: card } });

    await this.activityLogDao.create(
      {
        action: ACTION.CREATE,
        entityType: ENTITY_TYPE.CARD,
        entityTitle: card.name,
        workspaceId: workspaceId as any,
      },
      userId
    );

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

    await this.activityLogDao.create(
      {
        action: ACTION.UPDATE,
        entityType: ENTITY_TYPE.CARD,
        workspaceId: workspaceId as any,
        entityTitle: card.name,
      },
      userId
    );

    return card;
  }

  async delete(cardId: string, listId: any, workspaceId: any, userId: string) {
    await this.permission.hasPermission(workspaceId, userId);

    await this.dao.update(List, listId, {
      $pull: { cards: cardId },
    });

    const card = await this.dao.getById(Card, cardId);

    await this.activityLogDao.create(
      {
        action: ACTION.UPDATE,
        entityType: ENTITY_TYPE.LIST,
        entityTitle: card.name,
        workspaceId: workspaceId as any,
      },
      userId
    );

    await card.deleteOne();
  }

  async reorder(workspaceId: any, userId: string, lists: IList[]) {
    await this.permission.hasPermission(workspaceId, userId);

    for (const list of lists) {
      for (const card of list.cards) {
        // Update the order of the card
        await Card.updateOne(
          { _id: card._id },
          { $set: { order: card.order } }
        );
      }

      // Retrieve the updated cards and replace the cards array in the list
      const updatedCards = await Card.find({
        _id: {
          $in: list.cards.map((card) => card._id),
        },
      }).sort("order");

      await List.updateOne(
        { _id: list._id },
        { $set: { cards: updatedCards.map((card) => card._id) } }
      );
    }

    // Retrieve the updated lists and sort by order
    const updatedLists = await List.find({ boardId: lists[0].boardId })
      .sort("order")
      .populate("cards");
    return updatedLists;
  }
}
