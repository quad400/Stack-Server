import { Model } from "mongoose";
import {
  DatabaseException,
  ExceptionCodes,
} from "../exceptions/database.exception";
import Paginator from "./paginator.helper";

export class DaoHelper {
  async duplicate<T>(model: Model<T>, field: Record<string, any>) {
    const _model = await model.findOne(field);

    if (_model) {
      throw new DatabaseException(
        ExceptionCodes.DUPLICATE_ENTRY,
        `${model.modelName} already exists`
      );
    }
    return _model;
  }

  async getByData<T>(model: Model<T>, field: Record<string, any>) {
    const _model = await model.findOne(field);

    if (!_model) {
      throw new DatabaseException(
        ExceptionCodes.NOT_FOUND,
        `${model.modelName} not found`
      );
    }

    return _model;
  }

  async getById<T>(model: Model<T>, id: string, select?: string) {
    const _model = await model.findById(id).select(select as string);

    if (!_model) {
      throw new DatabaseException(
        ExceptionCodes.NOT_FOUND,
        `${model.modelName} not found`
      );
    }

    return _model;
  }

  async getAll<T>(options: {
    model: Model<T>;
    query: Record<string, any>;
    paginated?: boolean;
    optionalQuery?: any;
  }) {
    const { model, query, optionalQuery } = options;

    const paginated = options?.paginated || false;

    let _model;
    if (paginated) {
      // Instantiate Paginator with model, query and optionalQuery
      _model = new Paginator(model.find(optionalQuery), query);

      _model.search().filter().sort().limitFields().paginate();

      _model = await _model.paginateResult();
    } else {
      _model = model.find();
    }

    return _model;
  }

  async update<T>(model: Model<T>, id: string, body: any) {
    const _model = await model.findByIdAndUpdate(id, body, { new: true });

    if (!_model) {
      throw new DatabaseException(
        ExceptionCodes.NOT_FOUND,
        `${model.modelName} not found`
      );
    }

    return _model;
  }
}
