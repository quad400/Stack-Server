import { Router } from "express";
import { userRoutes } from "./user.route";
import { workspaceRoutes } from "./workspace.route";
import { uploadRoutes } from "./upload.route";
import { boardRoutes } from "./board.route";
import { listRoutes } from "./list.route";

export const rootRouter = Router();

rootRouter.use("/users", userRoutes);
rootRouter.use("/workspaces", workspaceRoutes);
rootRouter.use("/lists", listRoutes);
rootRouter.use("/boards", boardRoutes);
rootRouter.use("/upload", uploadRoutes);