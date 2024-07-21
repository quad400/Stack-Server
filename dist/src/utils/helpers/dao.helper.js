"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DaoHelper = void 0;
const database_exception_1 = require("../exceptions/database.exception");
const paginator_helper_1 = __importDefault(require("./paginator.helper"));
class DaoHelper {
    async duplicate(model, field) {
        const _model = await model.findOne(field);
        if (_model) {
            throw new database_exception_1.DatabaseException(database_exception_1.ExceptionCodes.DUPLICATE_ENTRY, `${model.modelName} already exists`);
        }
        return _model;
    }
    async getByData(model, field) {
        const _model = await model.findOne(field);
        if (!_model) {
            throw new database_exception_1.DatabaseException(database_exception_1.ExceptionCodes.NOT_FOUND, `${model.modelName} not found`);
        }
        return _model;
    }
    async getById(model, id, select) {
        const _model = await model.findById(id).select(select);
        if (!_model) {
            throw new database_exception_1.DatabaseException(database_exception_1.ExceptionCodes.NOT_FOUND, `${model.modelName} not found`);
        }
        return _model;
    }
    async getAll(options) {
        const { model, query, optionalQuery } = options;
        const paginated = options?.paginated || false;
        let _model;
        if (paginated) {
            // Instantiate Paginator with model, query and optionalQuery
            _model = new paginator_helper_1.default(model.find(optionalQuery), query);
            _model.search().filter().sort().limitFields().paginate();
            _model = await _model.paginateResult();
        }
        else {
            _model = model.find();
        }
        return _model;
    }
    async update(model, id, body) {
        const _model = await model.findByIdAndUpdate(id, body, { new: true });
        if (!_model) {
            throw new database_exception_1.DatabaseException(database_exception_1.ExceptionCodes.NOT_FOUND, `${model.modelName} not found`);
        }
        return _model;
    }
}
exports.DaoHelper = DaoHelper;
