import authRouter from "./auth/auth.routes.js";
import authAdminRouter from "./auth_Admin/auth.routes.js";
import bookRouter from "./book/book.routes.js";
import cartRoutr from "./cart/cart.routes.js";
import orderRouter from "./order/order.routes.js";
import userRouter from "./users/users.routes.js";

export const bootstrap = (app) => {
  app.use("/auth", authRouter);
  app.use("/auth_admin", authAdminRouter);
  app.use("/book", bookRouter);
  app.use("/user", userRouter);
  app.use("/cart", cartRoutr);
  app.use("/order", orderRouter);
};
