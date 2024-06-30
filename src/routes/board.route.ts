import { Router } from "express";
import { validator } from "../utils/helpers/validators.helper";
import { BoardController } from "../controllers/board.controller";
import { protect } from "../middlewares/auth.middleware";
import { CreateBoardDto } from "../dto/workspace.dto";
import { exceptionEscalator } from "../middlewares/exception.middleware";

export const boardRoutes = Router();

const boardController = new BoardController();

boardRoutes.use(protect);
boardRoutes.post(
  "/",
  validator({ dto: new CreateBoardDto() }),
  exceptionEscalator(boardController.create)
);
boardRoutes.get("/", exceptionEscalator(boardController.list));
boardRoutes.get("/:boardId", exceptionEscalator(boardController.get));
boardRoutes.patch("/:boardId", exceptionEscalator(boardController.update));
boardRoutes.delete("/:boardId", exceptionEscalator(boardController.delete));
