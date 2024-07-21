"use strict";
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
    async create(dto) {
        await this.daoHelper.duplicate(user_model_1.default, { email: dto.email });
        const user = await user_model_1.default.create(dto);
        return user;
    }
    async get({ _id }) {
        const user = await this.daoHelper.getById(user_model_1.default, _id, "-password");
        return user;
    }
    async getByData(data) {
        const user = await this.daoHelper.getByData(user_model_1.default, data);
        return user;
    }
    async activate(activationId) {
        const user = await user_model_1.default.findOne({
            activationCode: activationId,
            activationCodeExpire: { $gt: Date.now() },
        }).select("-password");
        return user;
    }
    async login(body) {
        const { email } = body;
        const user = await this.daoHelper.getByData(user_model_1.default, { email: email });
        return user;
    }
}
exports.UserDao = UserDao;
