import { Router } from "express";
import { userRoutes } from "./user.route";
import { workspaceRoutes } from "./workspace.route";
import { uploadRoutes } from "./upload.route";
import { boardRoutes } from "./board.route";
import { listRoutes } from "./list.route";
import { cardRoutes } from "./card.route";
import { memberRoutes } from "./member.route";
import { activityLogRoutes } from "./activitylog.route";

export const rootRouter = Router();

rootRouter.use("/users", userRoutes);
rootRouter.use("/workspaces", workspaceRoutes);
rootRouter.use("/activity-logs", activityLogRoutes);
rootRouter.use("/lists", listRoutes);
rootRouter.use("/cards", cardRoutes);
rootRouter.use("/boards", boardRoutes);
rootRouter.use("/upload", uploadRoutes);
rootRouter.use("/members", memberRoutes);
