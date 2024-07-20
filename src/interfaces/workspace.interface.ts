import { IMember } from "./member.interface";
import { IUser } from "./user.interface";

export interface IWorkspace {
  _id: string;
  createdBy: IUser;
  name: string;
  image: string;
  isPrivate: boolean;
  description: string;
  boards: IBoard[];
  inviteCode: string;
  members: IMember[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IBoard {
  _id: string;
  name: string;
  image: string;
  workspaceId: IWorkspace;
  lists: IList[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IList {
  _id: string;
  name: string;
  boardId: IBoard;
  order: number;
  cards: ICard[];
}


export enum ACTION {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE"
}

export enum ENTITY_TYPE {
  LIST = "LIST",
  BOARD = "BOARD",
  CARD = "CARD"
}

export interface IActivityLog {
  _id: string;
  entityType: ENTITY_TYPE;
  entityTitle: string;
  workspaceId: IWorkspace;
  action: ACTION
  user: IUser;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICard {
  _id: string;
  name: string;
  order: number;
  listId: IList;
  description?: string;
}

export type ICreateWorkspace = Pick<IWorkspace, "name" | "image">;
export type ICreateBoard = Pick<IBoard, "name" | "image">;
export type ICreateList = Pick<IList, "name">;
export type IActivityLogBody = Pick<IActivityLog, "entityType" | "action" | "workspaceId" | "entityTitle">;

export type QueryParams = string | string[] | undefined