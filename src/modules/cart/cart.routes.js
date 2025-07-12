import { Router } from "express";
import {
  addToCart,
  clearUserCart,
  getLoggedUserCart,
  removeFromCart,
  updateQuantity,
} from "./cart.controoler.js";
import { verifyToken } from "../../middleware/verifyToken.js";

const cartRoutr = Router();
cartRoutr.get("/", getLoggedUserCart);
cartRoutr.post("/addtocart", verifyToken, addToCart);
cartRoutr.put("/updatequantity/:id", verifyToken, updateQuantity);
cartRoutr.delete("/deletefromcart/:id", verifyToken, removeFromCart);
cartRoutr.delete("/clearcart", verifyToken, clearUserCart);

export default cartRoutr;
