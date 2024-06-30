import { Model } from "mongoose";
import { DaoHelper } from "./dao.helper";
import {
  DatabaseException,
  ExceptionCodes,
} from "../exceptions/database.exception";
import { IWorkspace } from "../../interfaces/workspace.interface";

export class Permission {
  private daoHelper = new DaoHelper();

  async isOwnerPermission<T>(
    model: Model<IWorkspace>,
    modelId: string,
    ownerId: string
  ) {
    const _model = await this.daoHelper.getByData(model, { _id: modelId });

    console.log(_model?.createdBy.toString(), ownerId.toString())
    const isOwner = _model?.createdBy.toString() === ownerId.toString();
    if (!isOwner) {
      throw new DatabaseException(
        ExceptionCodes.PERMISSION_DENIED,
        "Permission denied"
      );
    }
  }
}
