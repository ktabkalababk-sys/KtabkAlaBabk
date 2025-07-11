import jwt from "jsonwebtoken";
import { AppError } from "../utils/appError.js";

export const verifyToken = async (req, res, next) => {
  let { admin_token } = req.headers;
  let { token } = req.headers;
  if (req.originalUrl.includes("admin")) {
    jwt.verify(
      admin_token,
      process.env.SECKRET_KEY_ADMIN,
      async (err, decoded) => {
        if (err) return next(new AppError("invalid token...", 401));
        req.user = decoded;

        next();
      }
    );
  } else {
    jwt.verify(token, process.env.SECKRET_KEY, async (err, decoded) => {
      if (err) return next(new AppError("invalid token...", 401));
      req.user = decoded;

      next();
    });
  }
};
