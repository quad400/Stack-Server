import { Router } from "express";
import { validator } from "../utils/helpers/validators.helper";
import { protect } from "../middlewares/auth.middleware";
import { CreateListDto } from "../dto/workspace.dto";
import { exceptionEscalator } from "../middlewares/exception.middleware";
import { CardController } from "../controllers/card.controller";

export const cardRoutes = Router();

const cardController = new CardController();

cardRoutes.use(protect);
cardRoutes.post(
  "/",
  validator({ dto: new CreateListDto() }),
  exceptionEscalator(cardController.create)
);
cardRoutes.get("/", exceptionEscalator(cardController.list));
cardRoutes.get("/:cardId", exceptionEscalator(cardController.get));
cardRoutes.patch("/:cardId", exceptionEscalator(cardController.update));
cardRoutes.delete("/:cardId", exceptionEscalator(cardController.delete));
