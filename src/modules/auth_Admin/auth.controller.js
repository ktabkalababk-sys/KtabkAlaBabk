import bcrypt from "bcrypt";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utils/appError.js";
import jwt from "jsonwebtoken";
import { Admin } from "../../../database/models/admin.model.js";

//////////////////////////// Signup ////////////////////////////////////////////

const signup = catchError(async (req, res, next) => {
  let admin = new Admin(req.body);
  await admin.save();
  jwt.sign(
    { userId: admin._id, name: admin.fullName },
    process.env.SECKRET_KEY_ADMIN,
    (err, token) => {
      if (err) return next(new AppError("Token generation failed", 500));
      res.status(201).json({ message: "success...", token });
    }
  );
});

//////////////////////////// Signin ////////////////////////////////////////////

const signin = catchError(async (req, res, next) => {
  let admin = await Admin.findOne({ phoneNumber: req.body.phoneNumber });
  if (admin && bcrypt.compareSync(req.body.password, admin.password)) {
    return jwt.sign(
      { userId: admin._id, name: admin.fullName },
      process.env.SECKRET_KEY_ADMIN,
      (err, token) => {
        if (err) return next(new AppError("Token generation failed", 500));
        res.status(201).json({ message: "success...", token });
      }
    );
  }
  next(new AppError("incorrect password or email", 401));
});

////////////////////////////Change Password////////////////////////////////////////////

const chnagePassword = catchError(async (req, res, next) => {
  let admin = await User.findOne({ email: req.body.email });
  if (admin && bcrypt.compareSync(req.body.oldPassword, admin.password)) {
    await Admin.findOneAndUpdate(
      { email: req.body.email },
      { password: req.body.newPassword, passwordChangedAt: Date.now() }
    );
    return jwt.sign(
      { userId: admin._id, name: admin.fullName },
      process.env.SECKRET_KEY_ADMIN,
      (err, token) => {
        if (err) return next(new AppError("Token generation failed", 500));
        res.status(201).json({ message: "success...", token });
      }
    );
  }
  next(new AppError("incorrect password or email", 401));
});

export { signup, signin, chnagePassword };
