import { Router } from "express";
import DialogFlowController from "../Controllers/dialogFlowController.js";

const route = new Router();
const ctrl = new DialogFlowController();

route.post("/", ctrl.processarIntencoes);

export default route;