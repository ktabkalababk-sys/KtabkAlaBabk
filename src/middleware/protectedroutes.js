import { User } from "../../database/models/user.model.js";
import { AppError } from "../utils/appError.js";
import { catchError } from "./catchError.js";
import jwt from "jsonwebtoken";

export const protecetedRoutes = catchError(async (req, res, next) => {
  let { token } = req.headers;
  let userPayload = null;
  if (!token) return next(new AppError("token not provided.", 401));
  jwt.verify(token, process.env.SECKRET_KEY, (err, payload) => {
    if (err) return next(err, 401);
    userPayload = payload;
  });
  let user = await User.findById(userPayload.userId);
  if (!user) return next(new AppError("user not found", 401));

  if (user.passwordChangedAt) {
    let time = parseInt(user.passwordChangedAt.getTime() / 1000);
    if (time > userPayload.iat)
      return next(new AppError("invald token...log in again", 401));
  }

  req.user = user;

  next();
});
