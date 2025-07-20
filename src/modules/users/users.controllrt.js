import { User } from "../../../database/models/user.model.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utils/appError.js";

const getAllUser = catchError(async (req, res, next) => {
  let users = await User.find();
  if (!users) return next(new AppError("There Is no users", 404));
  res.status(201).json({ msg: "Success", users });
});
const getUser = catchError(async (req, res, next) => {
  let user = await User.findById(req.user.userId);
  if (!user) return next(new AppError("There Is no user", 404));
  res.status(201).json({ msg: "Success", user });
});

const updatUser = catchError(async (req, res, next) => {
  let user = await User.findById(req.user.userId);
  if (!user) return next(new AppError("There Is no User", 404));
  user.firstName = req.body.firstName || user.firstName;
  user.lastName = req.body.lastName || user.lastName;
  user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
  user.city = req.body.city || user.city;
  user.address = req.body.address || user.address;
  await user.save();
  res.status(201).json({ msg: "User Updated", user });
});

const deleteUser = catchError(async (req, res, next) => {
  let deletedUser = await User.findByIdAndDelete(req.params.id);
  if (!deletedUser) return next(new AppError("There Is no User", 404));
  res.status(201).json({ msg: "user Deleted" });
});

const seachUser = catchError(async (req, res, next) => {
  if (req.query.search) {
    const user = await User.find({
      phoneNumber: { $regex: req.query.search.trim(), $options: "i" },
    });
    return res.status(200).json({ message: "success", users: user });
  }
  res.status(200).json({ message: "there is no user to search for" });
});

export { getAllUser, getUser, updatUser, deleteUser, seachUser };
