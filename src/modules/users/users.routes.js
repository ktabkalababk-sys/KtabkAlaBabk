import { Router } from "express";
import { deleteUser, updatUser, getUser } from "./users.controllrt.js";
import { verifyToken } from "../../middleware/verifyToken.js";

const userRouter = Router();

userRouter.get("/", verifyToken, getUser);
userRouter.put("/edituser", verifyToken, updatUser);
userRouter.put("/admin/edituser", verifyToken, updatUser);
userRouter.delete("/admin/deleteuser/:id", verifyToken, deleteUser);

export default userRouter;
