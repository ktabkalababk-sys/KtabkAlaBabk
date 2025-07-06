export const globalError = (err, req, res, next) => {
  let code = err.statusCode || 400;
  res.status(code).json({ error: "error", message: err.message, code: code });
};
