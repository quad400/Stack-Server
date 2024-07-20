import { Request, Response } from "express";
import { ActivityLogDao } from "../dao/activitylog.dao";
import { ResponseHelper } from "../utils/helpers/response.helper";
import {
  HTTP_STATUS_CREATED,
  HTTP_STATUS_OK,
} from "../constants/status.constants";

export class ActivityLogController {
  private activityLogDao = new ActivityLogDao();

  create = async (req: Request, res: Response) => {
    const body = req.body;
    const userId = req.user._id;

    const activityLog = await this.activityLogDao.create(body, userId);

    ResponseHelper.successResponse({
      res,
      message: "Successfully created activity log",
      data: activityLog,
      statusCode: HTTP_STATUS_CREATED,
    });
  };

  list = async (req: Request, res: Response) => {
    const { workspaceId } = req.query;

    const activityLogs = await this.activityLogDao.list(workspaceId as string);

    ResponseHelper.successResponse({
      res,
      statusCode: HTTP_STATUS_OK,
      data: activityLogs,
    });
  };
}
