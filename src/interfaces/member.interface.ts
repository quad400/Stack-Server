import { IUser } from "./user.interface";
import { IWorkspace } from "./workspace.interface";

export interface IMember {
    _id: string;
    user: IUser;
    role: string;
    workspaceId: IWorkspace
    createdAt: Date;
}