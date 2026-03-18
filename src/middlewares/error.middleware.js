export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.log(err);
  return res.status(statusCode).json({
    status: statusCode,
    message: err.message || "Internal Server Error",
  });
};
