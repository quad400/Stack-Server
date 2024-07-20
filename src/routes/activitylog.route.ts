import { Router } from "express";
import { ActivityLogController } from "../controllers/activitylog.controller";
import { protect } from "../middlewares/auth.middleware";

export const activityLogRoutes = Router();

const activityLogController = new ActivityLogController();

activityLogRoutes.use(protect);

activityLogRoutes.post("/", activityLogController.create);
activityLogRoutes.get("/", activityLogController.list);
