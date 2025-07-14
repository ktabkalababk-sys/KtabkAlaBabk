import { User } from "../../../database/models/user.model.js";
import bcrypt from "bcrypt";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utils/appError.js";
import jwt from "jsonwebtoken";

//////////////////////////// Signup ////////////////////////////////////////////

const signup = catchError(async (req, res, next) => {
  let user = new User(req.body);
  await user.save();
  jwt.sign({ userId: user._id }, process.env.SECKRET_KEY, (err, token) => {
    if (err) return next(new AppError("Token generation failed", 500));
    res.status(201).json({ message: "success...", token });
  });
});

//////////////////////////// Signin ////////////////////////////////////////////

const signin = catchError(async (req, res, next) => {
  let user = await User.findOne({ phoneNumber: req.body.phoneNumber });
  if (!user) return next(new AppError("the user dosnt exist", 404));
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
  next(new AppError("incorrect password or phone", 401));
});

////////////////////////////Change Password////////////////////////////////////////////

const setDefaultPassword = catchError(async (req, res, next) => {
  let user = await User.findById(req.params.id);
  let defaultPassword = process.env.DEFAULT_PASSWORD;
  if (user) {
    await User.findByIdAndUpdate(req.params.id, { password: defaultPassword });
    return res.status(201).json({ message: "success..." });
  }
  next(new AppError("there is no user", 404));
});

export { signup, signin, setDefaultPassword };
