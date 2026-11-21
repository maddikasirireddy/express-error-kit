function asyncHandler(fn) {
  if (typeof fn !== 'function') throw new TypeError('asyncHandler expects a function');
  return function wrapped(req, res, next) {
    try {
      Promise.resolve(fn(req, res, next)).catch(next);
    } catch (error) {
      next(error);
    }
  };
}
module.exports = asyncHandler;
