import { User } from "../../../database/models/user.model.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utils/appError.js";

const getUser = catchError(async (req, res, next) => {
  let user = await User.findById(req.user.userId);
  if (!user) return next(new AppError("There Is no user", 404));
  res.status(201).json({ msg: "Success", user });
});

const updatUser = catchError(async (req, res, next) => {
  let updatedUser = await User.findByIdAndUpdate(
    req.user.userId,
    {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      city: req.body.city,
      address: req.body.address,
    },
    {
      new: true,
    }
  );
  if (!updatedUser) return next(new AppError("There Is no User", 404));
  await updatedUser.save();
  res.status(201).json({ msg: "User Updated", updatedUser });
});

const deleteUser = catchError(async (req, res, next) => {
  let deletedUser = await User.findByIdAndDelete(req.params.id);
  if (!deletedUser) return next(new AppError("There Is no User", 404));
  res.status(201).json({ msg: "user Deleted" });
});
export { getUser, updatUser, deleteUser };
