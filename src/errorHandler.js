function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  const status = Number.isInteger(err.statusCode) && err.statusCode >= 400 && err.statusCode <= 599
    ? err.statusCode : 500;
  const isServerError = status >= 500;
  const production = process.env.NODE_ENV === 'production';
  res.status(status).json({
    success: false,
    error: {
      message: production && isServerError ? 'Internal Server Error' : (err.message || 'Unexpected error'),
      code: err.code || (isServerError ? 'INTERNAL_ERROR' : 'REQUEST_ERROR'),
      statusCode: status
    }
  });
}
module.exports = errorHandler;
