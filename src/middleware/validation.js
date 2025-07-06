import { AppError } from "../utils/appError.js";

export const validate = (schema) => {
  return (req, res, next) => {
    let { error } = schema.validate(req.body, { abortEarly: false });
    if (!error) next();
    else next(new AppError(error, 403));
  };
};
