"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DaoHelper = void 0;
const database_exception_1 = require("../exceptions/database.exception");
const paginator_helper_1 = __importDefault(require("./paginator.helper"));
class DaoHelper {
    duplicate(model, field) {
        return __awaiter(this, void 0, void 0, function* () {
            const _model = yield model.findOne(field);
            if (_model) {
                throw new database_exception_1.DatabaseException(database_exception_1.ExceptionCodes.DUPLICATE_ENTRY, `${model.modelName} already exists`);
            }
            return _model;
        });
    }
    getByData(model, field) {
        return __awaiter(this, void 0, void 0, function* () {
            const _model = yield model.findOne(field);
            if (!_model) {
                throw new database_exception_1.DatabaseException(database_exception_1.ExceptionCodes.NOT_FOUND, `${model.modelName} not found`);
            }
            return _model;
        });
    }
    getById(model, id, select) {
        return __awaiter(this, void 0, void 0, function* () {
            const _model = yield model.findById(id).select(select);
            if (!_model) {
                throw new database_exception_1.DatabaseException(database_exception_1.ExceptionCodes.NOT_FOUND, `${model.modelName} not found`);
            }
            return _model;
        });
    }
    getAll(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { model, query, optionalQuery } = options;
            const paginated = (options === null || options === void 0 ? void 0 : options.paginated) || false;
            let _model;
            if (paginated) {
                // Instantiate Paginator with model, query and optionalQuery
                _model = new paginator_helper_1.default(model.find(optionalQuery), query);
                _model.search().filter().sort().limitFields().paginate();
                _model = yield _model.paginateResult();
            }
            else {
                _model = model.find();
            }
            return _model;
        });
    }
    update(model, id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const _model = yield model.findByIdAndUpdate(id, body, { new: true });
            if (!_model) {
                throw new database_exception_1.DatabaseException(database_exception_1.ExceptionCodes.NOT_FOUND, `${model.modelName} not found`);
            }
            return _model;
        });
    }
}
exports.DaoHelper = DaoHelper;
