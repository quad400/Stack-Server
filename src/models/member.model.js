"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Member = void 0;
const mongoose_1 = require("mongoose");
const memberSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
        required: true,
    },
    role: {
        type: String,
        required: true,
        default: "member",
    },
    workspaceId: {
        type: mongoose_1.Types.ObjectId,
        ref: "Workspace",
        required: true,
    },
}, { timestamps: true });
exports.Member = (0, mongoose_1.model)("Member", memberSchema);
