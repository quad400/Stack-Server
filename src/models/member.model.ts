import { Schema, Types, model } from "mongoose";
import { IMember } from "../interfaces/member.interface";

const memberSchema = new Schema<IMember>(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      required: true,
      default: "member",
    },
    workspaceId: {
      type: Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
  },
  { timestamps: true }
);

export const Member = model<IMember>("Member", memberSchema);
