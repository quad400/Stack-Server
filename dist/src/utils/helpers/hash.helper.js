"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hash = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
class Hash {
    async encrypt(text) {
        return await bcrypt_1.default.hash(text, 12);
    }
    async compare(hash, text) {
        return await bcrypt_1.default.compare(text, hash);
    }
}
exports.Hash = Hash;
