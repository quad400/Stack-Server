import { Router } from "express";
import MemberController from "../controllers/member.controller";
import { exceptionEscalator } from "../middlewares/exception.middleware";
import { protect } from "../middlewares/auth.middleware";

export const memberRoutes = Router();

const memberController = new MemberController();

memberRoutes.get("/", exceptionEscalator(memberController.lists));
memberRoutes.use(protect);
memberRoutes.post("/invite", exceptionEscalator(memberController.inviteMember));
memberRoutes.post("/accept/:inviteCode", exceptionEscalator(memberController.acceptInvite));
