"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTHelper = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../../constants/env");
class JWTHelper {
    generateToken(sub) {
        return {
            access: this.generateAccessToken(sub),
            refresh: this.generateRefreshToken(sub),
        };
    }
    generateAccessToken(sub) {
        return jsonwebtoken_1.default.sign(sub, env_1.JWT_ACCESS_KEY, {
            expiresIn: env_1.JWT_ACCESS_EXPIRY,
        });
    }
    generateRefreshToken(sub) {
        return jsonwebtoken_1.default.sign(sub, env_1.JWT_REFRESH_KEY, {
            expiresIn: env_1.JWT_REFRESH_EXPIRY,
        });
    }
    verifyAccessToken(token) {
        return jsonwebtoken_1.default.verify(token, env_1.JWT_ACCESS_KEY);
    }
    verifyRefreshToken(token) {
        return jsonwebtoken_1.default.verify(token, env_1.JWT_REFRESH_KEY);
    }
}
exports.JWTHelper = JWTHelper;
