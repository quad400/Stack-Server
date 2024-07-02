import { Request, Response } from "express";
import { WorkspaceDao } from "../dao/workspace.dao";
import { ICreateWorkspace } from "../interfaces/workspace.interface";
import { ResponseHelper } from "../utils/helpers/response.helper";
import {
  HTTP_STATUS_CREATED,
  HTTP_STATUS_OK,
} from "../constants/status.constants";

export class WorkspaceController {
  private readonly workspaceDao = new WorkspaceDao();

  create = async (req: Request, res: Response) => {
    const body = req.body as ICreateWorkspace;
    const userId = req.user;

    const workspace = await this.workspaceDao.create(body, userId);

    ResponseHelper.successResponse({
      res: res,
      message: "Successfully created workspace",
      data: workspace,
      statusCode: HTTP_STATUS_CREATED,
    });
  };

  get = async (req: Request, res: Response) => {
    const { workspaceId } = req.params;

    const workspace = await this.workspaceDao.get(workspaceId);
    ResponseHelper.successResponse({
      res: res,
      data: workspace,
      statusCode: HTTP_STATUS_OK,
    });
  }


  list = async (req: Request, res: Response) => {
    const userId = req.user;

    const workspace = await this.workspaceDao.list(userId);
    ResponseHelper.successResponse({
      res: res,
      data: workspace,
      statusCode: HTTP_STATUS_OK,
    });
  };

  update = async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const body = req.body;
    const { workspaceId } = req.params;

    const workspace = await this.workspaceDao.update(body, workspaceId, userId);
    ResponseHelper.successResponse({
      res: res,
      data: workspace,
      statusCode: HTTP_STATUS_OK,
    });
  };

  delete = async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { workspaceId } = req.params;

    await this.workspaceDao.delete(userId, workspaceId);
    ResponseHelper.successResponse({
      res: res,
      message: "Successfully deleted workspace",
      statusCode: HTTP_STATUS_OK,
    });
  };
}
