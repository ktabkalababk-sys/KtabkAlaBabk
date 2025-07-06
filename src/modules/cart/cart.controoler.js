import { Book } from "../../../database/models/books.model.js";
import { Cart } from "../../../database/models/cart.model.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utils/appError.js";

function calcTotalPrice(isCartExist) {
  isCartExist.totalCartPrice = isCartExist.cartItems.reduce((prev, item) => {
    return prev + item.quantity * item.price;
  }, 0);
}

const addToCart = catchError(async (req, res, next) => {
  let isCartExist = await Cart.findOne({ user: req.user.userId });

  let book = await Book.findById(req.body.book);
  if (!book) return next(new AppError("there is no book", 404));

  req.body.price = book.bookPrice;

  if (req.body.quantity > book.numberOfBooks)
    return next(new AppError("the number of books is exceeded", 404));
  if (!isCartExist) {
    let cart = new Cart({
      user: req.user.userId,
      cartItems: [req.body],
    });
    calcTotalPrice(cart);
    await cart.save();
    res.status(201).json({ msg: "Cart Created", cart });
  } else {
    let item = isCartExist.cartItems.find((item) => item.book == req.body.book);

    if (item) {
      item.quantity += req.body.quantity || 1;
      if (item.quantity > book.numberOfBooks)
        return next(new AppError("the number of books is exceeded", 404));
    }

    if (!item) isCartExist.cartItems.push(req.body);
    calcTotalPrice(isCartExist);
    await isCartExist.save();

    res.status(201).json({ msg: "success", cart: isCartExist });
  }
});

const updateQuantity = catchError(async (req, res, next) => {
  let cart = await Cart.findOne({ user: req.user.userId });
  let item = cart.cartItems.find((item) => item.book == req.params.id);
  let book = await Book.findById(item.book);
  if (!item) return next(new AppError("Product Not Found", 404));
  item.quantity = req.body.quantity;
  if (item.quantity > book.numberOfBooks)
    return next(new AppError("the number of books is exceeded", 404));
  calcTotalPrice(cart);
  await cart.save();
  res.status(201).json({ msg: "Quantity updated", cart });
});

const removeFromCart = catchError(async (req, res, next) => {
  let cart = await Cart.findOneAndUpdate(
    { user: req.user.userId },
    { $pull: { cartItems: { book: req.params.id } } },
    { new: true }
  );
  if (!cart) return next(new AppError("Cart Not Found", 404));
  calcTotalPrice(cart);
  await cart.save();
  res.status(201).json({ msg: "Book Deleted", cart });
});

const getLoggedUserCart = catchError(async (req, res, next) => {
  let cart = await Cart.findOne({ user: req.user.userId });
  if (!cart) return next(new AppError("Cart Not Found", 404));
  res.status(201).json({ msg: "success", cart });
});

const clearUserCart = catchError(async (req, res, next) => {
  let cart = await Cart.findOneAndDelete({ user: req.user.userId });
  if (!cart) return next(new AppError("Cart Not Found", 404));
  res.status(201).json({ msg: "success", cart });
});
export {
  addToCart,
  updateQuantity,
  removeFromCart,
  getLoggedUserCart,
  clearUserCart,
};
