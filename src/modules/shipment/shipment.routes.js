import { Router } from "express";
import { getShipmentCoast } from "./shipment.controller.js";

const shipmentRouter = Router();

shipmentRouter.get("/admin/getshipmentcoast", getShipmentCoast);

export default shipmentRouter;
