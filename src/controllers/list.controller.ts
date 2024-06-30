import { Request, Response } from "express";
import { ListDao } from "../dao/list.dao";
import { ICreateBoard } from "../interfaces/workspace.interface";
import { ResponseHelper } from "../utils/helpers/response.helper";
import {
  HTTP_STATUS_CREATED,
  HTTP_STATUS_OK,
} from "../constants/status.constants";

export class ListController {
  private listDao = new ListDao();

  create = async (req: Request, res: Response) => {
    const body = req.body as ICreateBoard;
    const userId = req.user._id;
    const { workspaceId, boardId } = req.query;

    const list = await this.listDao.create(body, userId, boardId, workspaceId);

    ResponseHelper.successResponse({
      res,
      statusCode: HTTP_STATUS_CREATED,
      data: list,
    });
  };

  list = async (req: Request, res: Response) => {
    const query = req.query;
    const { boardId } = req.query;

    const lists = await this.listDao.list(boardId, query);
    ResponseHelper.successResponse({
      res,
      statusCode: HTTP_STATUS_OK,
      data: lists,
    });
  };

  get = async (req: Request, res: Response) => {
    const { listId } = req.params;

    const list = await this.listDao.get(listId);
    ResponseHelper.successResponse({
      res,
      statusCode: HTTP_STATUS_OK,
      data: list,
    });
  };

  update = async (req: Request, res: Response) => {
    const body = req.body;
    const { _id: userId } = req.user;
    const { listId } = req.params;

    const { workspaceId, boardId } = req.query;
    const list = await this.listDao.update(listId, workspaceId, body, userId);

    ResponseHelper.successResponse({
      res,
      message: "Successfully updated board",
      statusCode: HTTP_STATUS_OK,
      data: list,
    });
  };

  delete = async (req: Request, res: Response) => {
    const { workspaceId, boardId } = req.query;
    const { _id: userId } = req.user;
    const { listId } = req.params;

    await this.listDao.delete(boardId, listId, workspaceId, userId);

    ResponseHelper.successResponse({
      res,
      message: "Successfully deleted board",
      statusCode: HTTP_STATUS_OK,
    });
  };
}
