import { Shipment } from "../../../database/models/shipment.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utils/appError.js";

const getShipmentCoast = catchError(async (req, res, next) => {
  const shipment = await Shipment.findOne({ _id: "shipment" });
  if (!shipment) return next(new AppError("there is no shipment cost", 404));
  console.log(shipment.costs);
  res.status(201).json({ msg: "success", shipment });
});
export { getShipmentCoast };
