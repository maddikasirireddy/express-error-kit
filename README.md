# Express Error Kit

A tiny CommonJS package for consistent JSON error responses in Express 4 and 5 applications.

## Why use it?

Avoid repeating async error forwarding and response formatting in each route. Server error messages are hidden when `NODE_ENV=production`.

## Installation

```bash
npm install express-error-kit express
```

## Basic usage

```js
const express = require('express');
const { AppError, asyncHandler, errorHandler } = require('express-error-kit');
const app = express();

app.get('/users/:id', asyncHandler(async (req, res) => {
  if (req.params.id !== '1') {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }
  res.json({ id: 1 });
}));

// Register after all routes.
app.use(errorHandler);
app.listen(3000);
```

For a missing user, the response has HTTP status 404:

```json
{"success":false,"error":{"message":"User not found","code":"USER_NOT_FOUND","statusCode":404}}
```

## API

- `new AppError(message, statusCode = 500, code = 'APP_ERROR')`: returns an `Error` with `message` (string), `statusCode` (HTTP status number), and `code` (application error identifier).
- `asyncHandler(fn)`: accepts an Express route or middleware function `(req, res, next)` and returns a middleware function that forwards thrown errors and rejected promises to `next`. In Express 5, async rejections are already forwarded automatically, but this helper also works with Express 4.
- `errorHandler(err, req, res, next)`: Express error middleware; returns JSON `{ success: false, error: { message, code, statusCode } }`. Use **after** routes. Calls `next(err)` if headers have already been sent.

## Testing

```bash
npm test
```

## Example server

From this repository:

```bash
npm install express
node examples/server.js
# visit http://localhost:3000/users/2
```

## Limitations

- CommonJS only; ESM projects can use a default import from CommonJS.
- This package does not log errors, validate request bodies, or handle non-Express processes.
- In production, messages for HTTP 5xx responses are replaced with `Internal Server Error`; 4xx messages are shown. Avoid putting secrets in client-facing 4xx messages.
- `AppError` does not validate constructor arguments; supply valid HTTP status codes.

## Contributing

Open an issue describing the change, create a branch, add tests, run `npm test`, and open a pull request.

## License

MIT
