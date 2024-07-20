import { Request, Response } from "express";
import { BoardDao } from "../dao/board.dao";
import { ACTION, ENTITY_TYPE, ICreateBoard, IWorkspace } from "../interfaces/workspace.interface";
import { ResponseHelper } from "../utils/helpers/response.helper";
import {
  HTTP_STATUS_CREATED,
  HTTP_STATUS_OK,
} from "../constants/status.constants";
import { ActivityLogDao } from "../dao/activitylog.dao";

export class BoardController {
  private boardDao = new BoardDao();
  private activityLogDao = new ActivityLogDao();

  create = async (req: Request, res: Response) => {
    const body = req.body as ICreateBoard;
    const userId = req.user._id;
    const { workspaceId } = req.query;

    const board = await this.boardDao.create(body, userId, workspaceId);


    ResponseHelper.successResponse({
      res,
      statusCode: HTTP_STATUS_CREATED,
      data: board,
    });
  };

  list = async (req: Request, res: Response) => {
    const query = req.query;
    const { workspaceId } = req.query;

    const boards = await this.boardDao.list(workspaceId, query);
    ResponseHelper.successResponse({
      res,
      statusCode: HTTP_STATUS_OK,
      data: boards,
    });
  };

  get = async (req: Request, res: Response) => {
    const { boardId } = req.params;

    const body = req.body;
    const board = await this.boardDao.get(boardId);
    ResponseHelper.successResponse({
      res,
      statusCode: HTTP_STATUS_OK,
      data: board,
    });
  };

  update = async (req: Request, res: Response) => {
    const body = req.body;
    const { _id: userId } = req.user;
    const { boardId } = req.params;

    const { workspaceId } = req.query;

    const board = await this.boardDao.update(
      boardId,
      workspaceId,
      body,
      userId
    );

    

    ResponseHelper.successResponse({
      res,
      message: "Successfully updated board",
      statusCode: HTTP_STATUS_OK,
      data: board,
    });
  };

  delete = async (req: Request, res: Response) => {

    const { workspaceId } = req.query;
    const { _id: userId } = req.user;
    const { boardId } = req.params;

    await this.boardDao.delete(boardId, workspaceId, userId);

    ResponseHelper.successResponse({
      res,
      message: "Successfully deleted board",
      statusCode: HTTP_STATUS_OK,
    });
  };
}
