"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: null,
    },
    emailVerified: {
        type: Boolean,
        default: false,
    },
    activationCode: String,
    activationCodeExpire: Date
}, { timestamps: true });
userSchema.methods.generateActivation = function () {
    const code = crypto_1.default.randomBytes(10).toString('hex');
    this.activationCode = code;
    let expiryDate = new Date();
    this.activationCodeExpire = expiryDate.setMinutes(expiryDate.getMinutes() + 10);
    return code;
};
const User = (0, mongoose_1.model)("User", userSchema);
exports.default = User;
