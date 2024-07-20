import { Schema, Types, model } from "mongoose";
import {
  IBoard,
  ICard,
  IList,
  IWorkspace,
} from "../interfaces/workspace.interface";
import { NextFunction } from "express";
import { Member } from "./member.model";

const workspaceSchema = new Schema<IWorkspace>(
  {
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
      type: [Types.ObjectId],
      ref: "Board",
      default: [],
    },
    createdBy: {
      type: Types.ObjectId,
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
      type: [Types.ObjectId],
      ref: "Member",
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const boardSchema = new Schema<IBoard>(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    lists: {
      type: [Types.ObjectId],
      ref: "List",
      default: [],
    },
    workspaceId: {
      type: Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const listSchema = new Schema<IList>(
  {
    name: {
      type: String,
      required: true,
    },
    cards: {
      type: [Types.ObjectId],
      ref: "Card",
      default: [],
    },
    boardId: {
      type: Types.ObjectId,
      ref: "Board",
      required: true,
    },
    order: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const cardSchema = new Schema<ICard>(
  {
    name: {
      type: String,
      required: true,
    },
    listId: {
      type: Types.ObjectId,
      ref: "List",
      required: true,
    },
    description: {
      type: String,
    },
    order: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

export const Workspace = model<IWorkspace>("Workspace", workspaceSchema);
export const Board = model<IBoard>("Board", boardSchema);
export const List = model<IList>("List", listSchema);
export const Card = model<ICard>("Card", cardSchema);

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
