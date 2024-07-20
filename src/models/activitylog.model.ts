import { model, Schema, Types } from "mongoose";
import { IActivityLog } from "../interfaces/workspace.interface";

const activityLogSchema = new Schema<IActivityLog>(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    entityType: {
      type: String,
      required: true,
      enum: ["LIST", "BOARD", "CARD"],
    },
    entityTitle: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: ["CREATE", "UPDATE", "DELETE"],
    },
    workspaceId: {
      type: Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
  },
  { timestamps: true }
);

const ActivityLog = model<IActivityLog>("ActivityLog", activityLogSchema);

export default ActivityLog;
