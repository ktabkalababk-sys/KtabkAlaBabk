import { Router } from "express";
import {
  deleteUser,
  updatUser,
  getUser,
  getAllUser,
  seachUser,
} from "./users.controllrt.js";
import { verifyToken } from "../../middleware/verifyToken.js";
import { validate } from "../../middleware/validation.js";
import { userVal } from "./user.validation.js";

const userRouter = Router();

userRouter.get("/admin/getalluser", verifyToken, getAllUser);
userRouter.get("/admin/searchbook", verifyToken, seachUser);
userRouter.get("/", verifyToken, getUser);
userRouter.put("/edituser", validate(userVal), verifyToken, updatUser);
userRouter.put("/admin/edituser", verifyToken, updatUser);
userRouter.delete("/admin/deleteuser/:id", verifyToken, deleteUser);

export default userRouter;
