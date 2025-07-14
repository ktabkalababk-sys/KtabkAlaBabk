import { Router } from "express";
import { createOrder, getOrder } from "./order.controller.js";
import { verifyToken } from "../../middleware/verifyToken.js";

const orderRouter = Router();

orderRouter.get("/getorder", verifyToken, getOrder);
orderRouter.post("/createorder/:id", verifyToken, createOrder);

export default orderRouter;
