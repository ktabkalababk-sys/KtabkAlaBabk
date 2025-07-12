import { Cart } from "../../../database/models/cart.model.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utils/appError.js";

const createOrder = catchError(async (req, res, next) => {
  let cart = await Cart.findById(req.params.id);
  if (!cart) return next(new AppError("there is no cart", 404));
  let totalOrderPrice = cart.totalCartPrice;
});

export { createOrder };
