import { mongoose, Schema } from "mongoose";

const schema = new mongoose.Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    cartItems: [
      {
        book: { type: Schema.Types.ObjectId, ref: "Book" },
        quantity: { type: Number, default: 1 },
        price: Number,
      },
    ],
    totalCartPrice: Number,
  },
  { versionKey: false, timestamps: true }
);
export const Cart = mongoose.model("Cart", schema);
