import { Cart } from "../../../database/models/cart.model.js";
import { Order } from "../../../database/models/order.model.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utils/appError.js";

const getOrder = catchError(async (req, res, next) => {
  const order = await Order.findOne({ user: req.user.userId }).populate(
    "user orderItems.book"
  );
  if (!order) return next(new AppError("there is no orders", 404));
  res.status(201).json({ msg: "success", order });
});

const createOrder = catchError(async (req, res, next) => {
  let shipmentCost = [
    { city: "القاهرة", price: 10 },
    { city: "الجيزة", price: 20 },
    { city: "الإسكندرية", price: 30 },
    { city: "بورسعيد", price: 40 },
  ];
  let totalWeight = 0;

  let cart = await Cart.findById(req.params.id).populate("user cartItems.book");
  if (!cart) return next(new AppError("there is no cart", 404));

  totalWeight = cart.cartItems.reduce((sum, item) => {
    return sum + item.book.weightOfBooks;
  }, 0);

  let cityPrice = shipmentCost.find((item) => item.city === cart.user.city);
  let OrderPrice = cart.totalCartPrice + cityPrice.price;

  // console.log(cart.cartItems);
  totalWeight = cart.cartItems.reduce((sum, item) => {
    return sum + item.book.weightOfBooks;
  }, 0);

  let order = new Order({
    user: req.user.userId,
    orderItems: cart.cartItems,
    totaOrderlWeight: totalWeight,
    totalOrderPrice: OrderPrice,
  });
  await order.save();
  let oldPrice = cart.totalCartPrice;
  res.status(201).json({ msg: "success", order, oldPrice });
});

export { createOrder, getOrder };
