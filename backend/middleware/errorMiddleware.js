// This middleware is used to handle errors in the application
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;

  res.status(statusCode);

  res.json({
    message: err.message,
    success: false,
  });
};

module.exports = {
  errorHandler,
}; 