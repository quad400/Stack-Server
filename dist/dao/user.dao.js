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
exports.UserDao = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const dao_helper_1 = require("../utils/helpers/dao.helper");
const hash_helper_1 = require("../utils/helpers/hash.helper");
class UserDao {
    constructor() {
        this.daoHelper = new dao_helper_1.DaoHelper();
        this.hashHelper = new hash_helper_1.Hash();
    }
    create(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.daoHelper.duplicate(user_model_1.default, { email: dto.email });
            const user = yield user_model_1.default.create(dto);
            return user;
        });
    }
    get(_a) {
        return __awaiter(this, arguments, void 0, function* ({ _id }) {
            const user = yield this.daoHelper.getById(user_model_1.default, _id, "-password");
            return user;
        });
    }
    getByData(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.daoHelper.getByData(user_model_1.default, data);
            return user;
        });
    }
    activate(activationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.default.findOne({
                activationCode: activationId,
                activationCodeExpire: { $gt: Date.now() },
            }).select("-password");
            return user;
        });
    }
    login(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = body;
            const user = yield this.daoHelper.getByData(user_model_1.default, { email: email });
            return user;
        });
    }
}
exports.UserDao = UserDao;
