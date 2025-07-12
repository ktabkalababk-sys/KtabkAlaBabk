import jwt from "jsonwebtoken";
import { AppError } from "../utils/appError.js";

export const verifyToken = async (req, res, next) => {
  // Debug logging
  console.log("=== TOKEN DEBUG ===");
  console.log("Request URL:", req.originalUrl);
  console.log("All headers:", req.headers);
  console.log("Token from headers:", req.headers.token);
  console.log("Admin token from headers:", req.headers.admin_token);
  console.log("Authorization header:", req.headers.authorization);
  console.log("===================");

  let { admin_token } = req.headers;
  let { token } = req.headers;

  if (req.originalUrl.includes("admin")) {
    if (!admin_token) {
      console.log("No admin token found");
      return next(new AppError("invalid token...", 401));
    }
    jwt.verify(
      admin_token,
      process.env.SECKRET_KEY_ADMIN,
      async (err, decoded) => {
        if (err) {
          console.log("Admin token verification failed:", err.message);
          return next(new AppError("invalid token...", 401));
        }
        req.user = decoded;
        next();
      }
    );
  } else {
    if (!token) {
      console.log("No token found in headers");
      return next(new AppError("invalid token...", 401));
    }
    jwt.verify(token, process.env.SECKRET_KEY, async (err, decoded) => {
      if (err) {
        console.log("Token verification failed:", err.message);
        return next(new AppError("invalid token...", 401));
      }
      req.user = decoded;
      next();
    });
  }
};
