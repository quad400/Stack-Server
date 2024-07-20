import { Model } from "mongoose";
import { DaoHelper } from "./dao.helper";
import {
  DatabaseException,
  ExceptionCodes,
} from "../exceptions/database.exception";
import { IWorkspace, QueryParams } from "../../interfaces/workspace.interface";
import { Member } from "../../models/member.model";
import { IMember } from "../../interfaces/member.interface";

export class Permission {
  private daoHelper = new DaoHelper();

  async hasPermission<T>(modelId: QueryParams, ownerId: string) {
    const member = (await Member.findOne({
      workspaceId: modelId,
      user: ownerId,
    })) as boolean;

    if (!member) {
      throw new DatabaseException(
        ExceptionCodes.PERMISSION_DENIED,
        "Permission denied"
      );
    }

    return true
  }

  async IsAdmin(modelId: string, userId: string) {
    const member = (await Member.findOne({
      workspaceId: modelId,
      user: userId,
      role: "admin",
    })) as boolean;

    if (!member) {
      throw new DatabaseException(
        ExceptionCodes.PERMISSION_DENIED,
        "Permission denied"
      );
    }

    return true;
  }
}
