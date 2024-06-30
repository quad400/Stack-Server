import { IUser } from "./user.interface";

export interface IWorkspace {
  _id: string;
  createdBy: IUser;
  name: string;
  image: string;
  boards: IBoard[];
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
