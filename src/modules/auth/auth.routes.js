import { Router } from "express";
import { chnagePassword, signin, signup } from "./auth.controller.js";
import { cheackPhone } from "../../middleware/cheackPhone.js";
import { validate } from "../../middleware/validation.js";
import { signinval, signupval } from "./auth.validation.js";
const authRouter = Router();

authRouter.post("/signup", validate(signupval), cheackPhone, signup);
authRouter.post("/signin", validate(signinval), signin);
authRouter.post("/changepassword", chnagePassword);

export default authRouter;
