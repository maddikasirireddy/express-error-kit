// Run `npm install express` before running this example.
const express = require('express');
const {
  AppError,
  asyncHandler,
  errorHandler
} = require("express-error-kit-siri");
const app = express();
app.get('/hello', (req, res) => res.json({ message: 'Hello!' }));
app.get('/users/:id', asyncHandler(async (req, res) => {
  if (req.params.id !== '1') throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  res.json({ id: 1, name: 'Demo User' });
}));
app.use(errorHandler);
app.listen(3000, () => console.log('Example at http://localhost:3000'));
