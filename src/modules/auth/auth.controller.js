import { User } from "../../../database/models/user.model.js";
import bcrypt from "bcrypt";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utils/appError.js";
import jwt from "jsonwebtoken";

//////////////////////////// Signup ////////////////////////////////////////////

const signup = catchError(async (req, res, next) => {
  let user = new User(req.body);
  await user.save();
  jwt.sign(
    { userId: user._id },
    process.env.SECKRET_KEY,
    (err, token) => {
      if (err) return next(new AppError("Token generation failed", 500));
      res.status(201).json({ message: "success...", token });
    }
  );
});

//////////////////////////// Signin ////////////////////////////////////////////

const signin = catchError(async (req, res, next) => {
  let user = await User.findOne({ phoneNumber: req.body.phoneNumber });
  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    return jwt.sign(
      { userId: user._id },
      process.env.SECKRET_KEY,
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
  let user = await User.findOne({ email: req.body.email });

  if (user && bcrypt.compareSync(req.body.oldPassword, user.password)) {
    await User.findOneAndUpdate(
      { email: req.body.email },
      { password: req.body.newPassword, passwordChangedAt: Date.now() }
    );
    return jwt.sign(
      { userId: user._id },
      process.env.SECKRET_KEY,
      (err, token) => {
        if (err) return next(new AppError("Token generation failed", 500));
        res.status(201).json({ message: "success...", token });
      }
    );
  }
  next(new AppError("incorrect password or email", 401));
});

export { signup, signin, chnagePassword };
