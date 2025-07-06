import { Admin } from "../../database/models/admin.model.js";
import { User } from "../../database/models/user.model.js";
import { AppError } from "../utils/appError.js";
import { catchError } from "./catchError.js";

export const cheackPhone = catchError(async (req, res, next) => {
  let phone;
  if (req.originalUrl.includes("auth_admin"))
    phone = await Admin.findOne({ phoneNumber: req.body.phoneNumber });
  else {
    phone = await User.findOne({ phoneNumber: req.body.phoneNumber });
  }
  if (phone) return next(new AppError("phone is already exist.", 409));
  next();
});
