import { Router } from "express";
import { validator } from "../utils/helpers/validators.helper";
import { protect } from "../middlewares/auth.middleware";
import { CreateListDto } from "../dto/workspace.dto";
import { exceptionEscalator } from "../middlewares/exception.middleware";
import { ListController } from "../controllers/list.controller";

export const listRoutes = Router();

const listController = new ListController();

listRoutes.use(protect);
listRoutes.post(
  "/",
  validator({ dto: new CreateListDto() }),
  exceptionEscalator(listController.create)
);
listRoutes.get("/", exceptionEscalator(listController.list));
listRoutes.get("/:listId", exceptionEscalator(listController.get));
listRoutes.patch("/:listId", exceptionEscalator(listController.update));
listRoutes.delete("/:listId", exceptionEscalator(listController.delete));
