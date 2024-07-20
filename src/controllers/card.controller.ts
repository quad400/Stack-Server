import { Request, Response } from "express";
import { CardDao } from "../dao/card.dao";
import {
  ACTION,
  ENTITY_TYPE,
  ICreateBoard,
} from "../interfaces/workspace.interface";
import { ResponseHelper } from "../utils/helpers/response.helper";
import {
  HTTP_STATUS_CREATED,
  HTTP_STATUS_OK,
} from "../constants/status.constants";

export class CardController {
  private cardDao = new CardDao();

  create = async (req: Request, res: Response) => {
    const body = req.body as ICreateBoard;
    const userId = req.user._id;
    const { workspaceId, listId } = req.query;

    const card = await this.cardDao.create(body, userId, listId, workspaceId);

    ResponseHelper.successResponse({
      res,
      statusCode: HTTP_STATUS_CREATED,
      data: card,
    });
  };

  list = async (req: Request, res: Response) => {
    const query = req.query;
    const { listId } = req.query;

    const cards = await this.cardDao.list(listId, query);
    ResponseHelper.successResponse({
      res,
      statusCode: HTTP_STATUS_OK,
      data: cards,
    });
  };

  get = async (req: Request, res: Response) => {
    const { cardId } = req.params;

    const card = await this.cardDao.get(cardId);
    ResponseHelper.successResponse({
      res,
      statusCode: HTTP_STATUS_OK,
      data: card,
    });
  };

  update = async (req: Request, res: Response) => {
    const body = req.body;
    const { _id: userId } = req.user;
    const { cardId } = req.params;

    const { workspaceId } = req.query;
    const card = await this.cardDao.update(cardId, workspaceId, body, userId);

    ResponseHelper.successResponse({
      res,
      message: "Successfully updated board",
      statusCode: HTTP_STATUS_OK,
      data: card,
    });
  };

  delete = async (req: Request, res: Response) => {
    const { workspaceId, listId } = req.query;
    const { _id: userId } = req.user;
    const { cardId } = req.params;

    await this.cardDao.delete(cardId, listId, workspaceId, userId);

    ResponseHelper.successResponse({
      res,
      message: "Successfully deleted board",
      statusCode: HTTP_STATUS_OK,
    });
  };

  reorder = async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { workspaceId } = req.query;

    const lists = req.body;

    const dao = await this.cardDao.reorder(workspaceId, userId, lists);

    ResponseHelper.successResponse({
      res: res,
      message: "Successfully reorder card",
      statusCode: HTTP_STATUS_OK,
      data: dao,
    });
  };
}
