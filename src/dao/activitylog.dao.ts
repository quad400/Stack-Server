import { IActivityLogBody } from "../interfaces/workspace.interface";
import ActivityLog from "../models/activitylog.model";

export class ActivityLogDao {

  async create(body: IActivityLogBody, userId: string) {
    const activityLog = await ActivityLog.create({
      user: userId,
      ...body,
    });

    return activityLog;
  }

  async list(workspaceId: string) {
    const activityLogs = await ActivityLog.find({
      workspaceId: workspaceId,
    }).populate({ path: "user", select: "fullName email" });

    return activityLogs;
  }
}
