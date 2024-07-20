import mongoose from "mongoose";
import {
  ACTION,
  ENTITY_TYPE,
  ICreateList,
  IList,
  QueryParams,
} from "../interfaces/workspace.interface";
import { Board, Card, List, Workspace } from "../models/workspace.model";
import { DaoHelper } from "../utils/helpers/dao.helper";
import { Permission } from "../utils/helpers/permissions.helper";
import { ActivityLogDao } from "./activitylog.dao";

export class ListDao {
  private dao = new DaoHelper();
  private permission = new Permission();
  private activityLogDao = new ActivityLogDao();

  async create(
    body: ICreateList,
    userId: string,
    boardId: any,
    workspaceId: any
  ) {
    await this.permission.hasPermission(workspaceId, userId);

    const highestOrderCard = await List.findOne({ boardId: boardId }).sort(
      "-order"
    );
    const order = highestOrderCard ? highestOrderCard.order + 1 : 0;

    const list = await List.create({ boardId: boardId, order: order, ...body });

    await this.dao.update(Board, boardId, { $push: { lists: list } });

    
    await this.activityLogDao.create(
      {
        action: ACTION.CREATE,
        entityType: ENTITY_TYPE.LIST,
        entityTitle: list.name,
        workspaceId: workspaceId as any,
      },
      userId
    );

    return list;
  }

  async get(listId: string) {
    const list = await List.findById(listId).populate("cards");

    console.log(list);
    return list;
  }

  async list(boardId: any) {
    const lists = await List.find({ boardId: boardId })
      .populate("cards")
      .sort({ order: 1 });

    return lists;
  }

  async update(
    listId: string,
    workspaceId: any,
    body: Record<string, any>,
    userId: string
  ) {
    await this.permission.hasPermission(workspaceId, userId);

    const list = await this.dao.update(List, listId, body);

    await this.activityLogDao.create(
      {
        action: ACTION.UPDATE,
        entityType: ENTITY_TYPE.LIST,
        entityTitle: list.name,
        workspaceId: workspaceId as any,
      },
      userId
    );
    return list;
  }

  async delete(boardId: any, listId: string, workspaceId: any, userId: string) {
    await this.permission.hasPermission(workspaceId, userId);

    await this.dao.update(Board, boardId, {
      $pull: { lists: listId },
    });

    const list = await this.dao.getByData(List, { boardId: boardId });

    const cards = await Card.find({ listId: list._id });
    cards.map(async (card) => {
      await card.deleteOne();
    });

    await this.activityLogDao.create(
      {
        action: ACTION.UPDATE,
        entityType: ENTITY_TYPE.LIST,
        entityTitle: list.name,
        workspaceId: workspaceId as any,
      },
      userId
    );


    await list.deleteOne();
  }

  async reorder(
    boardId: any,
    workspaceId: any,
    userId: string,
    lists: IList[]
  ) {
    await this.permission.hasPermission(workspaceId, userId);

    for (const list of lists) {
      await List.updateOne(
        { _id: list._id, boardId },
        { $set: { order: list.order } }
      );
    }

    const updatedLists = await List.find({ boardId }).sort("order");

    return updatedLists;
  }
}
