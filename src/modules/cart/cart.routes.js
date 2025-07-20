import { Router } from "express";
import {
  addToCart,
  clearUserCart,
  getLoggedUserCart,
  removeFromCart,
  updateQuantity,
} from "./cart.controoler.js";
import { verifyToken } from "../../middleware/verifyToken.js";
import { validate } from "../../middleware/validation.js";
import { addCartVal, updateQuantityVal } from "./cart.validation.js";

const cartRoutr = Router();
cartRoutr.get("/getcart", verifyToken, getLoggedUserCart);
cartRoutr.post("/addtocart", validate(addCartVal), verifyToken, addToCart);
cartRoutr.put(
  "/updatequantity/:id",
  validate(updateQuantityVal),
  verifyToken,
  updateQuantity
);
cartRoutr.delete("/deletefromcart/:id", verifyToken, removeFromCart);
cartRoutr.delete("/clearcart", verifyToken, clearUserCart);

export default cartRoutr;
