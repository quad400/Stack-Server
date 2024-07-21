"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const activityLogSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
        required: true,
    },
    entityType: {
        type: String,
        required: true,
        enum: ["LIST", "BOARD", "CARD"],
    },
    entityTitle: {
        type: String,
        required: true,
    },
    action: {
        type: String,
        required: true,
        enum: ["CREATE", "UPDATE", "DELETE"],
    },
    workspaceId: {
        type: mongoose_1.Types.ObjectId,
        ref: "Workspace",
        required: true,
    },
}, { timestamps: true });
const ActivityLog = (0, mongoose_1.model)("ActivityLog", activityLogSchema);
exports.default = ActivityLog;
