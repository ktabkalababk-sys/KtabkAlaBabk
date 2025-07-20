import { Router } from "express";
import {
  confirmOrder,
  confirmPayment,
  createOrder,
  excelFile,
  getAllOrders,
  getOrder,
} from "./order.controller.js";
import { verifyToken } from "../../middleware/verifyToken.js";
import { fileUpload } from "../../middleware/fileUpload.js";
import { validate } from "../../middleware/validation.js";
import { confirmOrderVal, getAllOrdersVal } from "./order.validation.js";

const orderRouter = Router();

orderRouter.get("/getorder", verifyToken, getOrder);
orderRouter.get("/admin/donloadexcelfile", verifyToken, excelFile);
orderRouter.post(
  "/admin/getallorders",
  validate(getAllOrdersVal),
  verifyToken,
  getAllOrders
);
orderRouter.post("/createorder/:id", verifyToken, createOrder);
orderRouter.post("/admin/confirmpayment/:id", verifyToken, confirmPayment);
orderRouter.put(
  "/confirmorder/:id",
  verifyToken,
  fileUpload({}).fields([{ name: "receiptImage", maxCount: 1 }]),
  validate(confirmOrderVal),
  confirmOrder
);
export default orderRouter;
