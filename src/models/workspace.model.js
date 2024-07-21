"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = exports.List = exports.Board = exports.Workspace = void 0;
const mongoose_1 = require("mongoose");
const workspaceSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    description: {
        type: String
    },
    boards: {
        type: [mongoose_1.Types.ObjectId],
        ref: "Board",
        default: [],
    },
    createdBy: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
        required: true,
    },
    inviteCode: {
        type: String,
        default: null,
    },
    isPrivate: {
        type: Boolean,
        default: true
    },
    members: {
        type: [mongoose_1.Types.ObjectId],
        ref: "Member",
        default: [],
    },
}, {
    timestamps: true,
});
const boardSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    lists: {
        type: [mongoose_1.Types.ObjectId],
        ref: "List",
        default: [],
    },
    workspaceId: {
        type: mongoose_1.Types.ObjectId,
        ref: "Workspace",
        required: true,
    },
}, {
    timestamps: true,
});
const listSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    cards: {
        type: [mongoose_1.Types.ObjectId],
        ref: "Card",
        default: [],
    },
    boardId: {
        type: mongoose_1.Types.ObjectId,
        ref: "Board",
        required: true,
    },
    order: {
        type: Number,
    },
}, {
    timestamps: true,
});
const cardSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    listId: {
        type: mongoose_1.Types.ObjectId,
        ref: "List",
        required: true,
    },
    description: {
        type: String,
    },
    order: {
        type: Number,
    },
}, {
    timestamps: true,
});
exports.Workspace = (0, mongoose_1.model)("Workspace", workspaceSchema);
exports.Board = (0, mongoose_1.model)("Board", boardSchema);
exports.List = (0, mongoose_1.model)("List", listSchema);
exports.Card = (0, mongoose_1.model)("Card", cardSchema);
// workspaceSchema.pre(
//   "deleteOne",
//   { document: true, query: false },
//   async function (next: NextFunction) {
//     try {
//       await Member.deleteMany({ workspaceId: this._id });
//       next();
//     } catch (error) {
//       next(error);
//     }
//   }
// );
