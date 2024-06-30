import { Router } from "express";
import { validator } from "../utils/helpers/validators.helper";
import { WorkspaceController } from "../controllers/workspace.controller";
import { protect } from "../middlewares/auth.middleware";
import { CreateModelDto } from "../dto/workspace.dto";
import { exceptionEscalator } from "../middlewares/exception.middleware";

export const workspaceRoutes = Router();

const workspaceController = new WorkspaceController();

workspaceRoutes.use(protect);
workspaceRoutes.post(
  "/",
  validator({ dto: new CreateModelDto() }),
  exceptionEscalator(workspaceController.create)
);
workspaceRoutes.get("/", exceptionEscalator(workspaceController.list));
workspaceRoutes.patch("/:workspaceId", exceptionEscalator(workspaceController.update));
workspaceRoutes.delete(":/workspaceId", exceptionEscalator(workspaceController.delete))
