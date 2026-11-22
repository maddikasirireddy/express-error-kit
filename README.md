# Express Error Kit

**A lightweight error-handling toolkit for Express.js APIs.**

[![npm](https://img.shields.io/npm/v/express-error-kit-siri)](https://www.npmjs.com/package/express-error-kit-siri)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**[NPM Package](https://www.npmjs.com/package/express-error-kit-siri) · [Live Interactive Demo](https://express-error-kit-web-demo.vercel.app/) · [Demo Source Code](https://github.com/maddikasirireddy/express-error-kit-web-demo)**

## The Problem

Error handling is a necessary part of every backend application. As an Express API grows, developers repeatedly need to handle missing resources, rejected promises, invalid operations, and unexpected server failures.

Without a consistent approach, different endpoints may return different error formats, duplicate error-handling logic, or accidentally expose internal failure details.

## The Solution

**Express Error Kit** packages three commonly needed error-handling utilities into a reusable NPM library:

| Utility | Responsibility |
|---|---|
| `AppError` | Create meaningful application errors with HTTP status codes and custom identifiers |
| `asyncHandler` | Forward errors from asynchronous route handlers |
| `errorHandler` | Centralize error responses into a predictable JSON format |

Instead of implementing the same error-handling pattern separately in each Express project, developers can install and reuse the package.

## Key Features

- **Consistent JSON responses** across error-producing routes
- **Custom HTTP errors** with status codes and identifiers
- **Asynchronous error forwarding**, especially useful with Express 4
- **Centralized middleware** for formatting errors
- **Production-aware messaging** that hides internal 5xx error details
- **Express 4 and 5 compatibility**
- **Small CommonJS implementation** with a focused API

## Try It Live

**[Open the Interactive Demo](https://express-error-kit-web-demo.vercel.app/)**

The deployed web application demonstrates the package using a user-lookup interface.

| Action | Expected status | What it demonstrates |
|---|---|---|
| Search user ID `1` | 200 OK | Normal API response |
| Search user ID `2` | 200 OK | Normal API response |
| Search user ID `99` | 404 Not Found | Custom `AppError` |
| Trigger server error | 500 Internal Server Error | Asynchronous error handling and centralized formatting |

The demo installs the published NPM package as a dependency rather than copying its source code.

## Installation

For an existing Express project:

```bash
npm install express-error-kit-siri
```

For a new Express project:

```bash
npm install express express-error-kit-siri
```

## Quick Start

```javascript
const express = require("express");
const {
  AppError,
  asyncHandler,
  errorHandler
} = require("express-error-kit-siri");

const app = express();

app.get("/users/:id", asyncHandler(async (req, res) => {
  const user = { id: 1, name: "Siri" };

  if (Number(req.params.id) !== user.id) {
    throw new AppError(
      "User not found",
      404,
      "USER_NOT_FOUND"
    );
  }

  res.json({ success: true, user });
}));

// Register after all routes
app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

Start the server:

```bash
node server.js
```

### Example error response

Request:

```http
GET /users/99
```

Response — HTTP 404:

```json
{
  "success": false,
  "error": {
    "message": "User not found",
    "code": "USER_NOT_FOUND",
    "statusCode": 404
  }
}
```

This consistent response structure makes errors easier for frontend applications to display and handle.

## How It Works

```text
Client sends an HTTP request
            |
            v
     Express route
            |
            v
    Application error
       (AppError)
            |
            v
       asyncHandler
            |
            v
       errorHandler
            |
            v
   Structured JSON response
```

`AppError` represents expected application failures, such as a missing user. `asyncHandler` forwards errors from asynchronous handlers to Express. `errorHandler` then formats the failure into a consistent response.

For unexpected failures, the error middleware also supports safer production messaging.

## API Reference

### `AppError(message, statusCode, code)`

Creates a custom error object.

| Parameter | Type | Default | Purpose |
|---|---|---|---|
| `message` | string | Required | Human-readable error description |
| `statusCode` | number | `500` | HTTP status |
| `code` | string | `APP_ERROR` | Application-specific identifier |

Example:

```javascript
throw new AppError("Access denied", 403, "ACCESS_DENIED");
```

### `asyncHandler(fn)`

Accepts an Express route or middleware function and returns a wrapped function that forwards thrown errors and rejected promises to Express error middleware.

```javascript
app.get("/example", asyncHandler(async (req, res) => {
  throw new Error("Unexpected failure");
}));
```

Express 5 already forwards rejected promises automatically; this utility is particularly helpful for Express 4 applications.

### `errorHandler(err, req, res, next)`

Centralized Express error middleware that returns structured JSON responses.

```javascript
app.use(errorHandler);
```

Register it **after your routes**. If response headers have already been sent, it delegates the error to the next handler.

## Production Error Handling

When `NODE_ENV=production`, internal error messages for HTTP 5xx responses are replaced with a generic message:

```json
{
  "success": false,
  "error": {
    "message": "Internal Server Error",
    "code": "INTERNAL_ERROR",
    "statusCode": 500
  }
}
```

This reduces the risk of exposing internal implementation details through API responses. It is not a substitute for authentication, authorization, logging, or other security controls.

## Project Structure

```text
express-error-kit/
├── src/
│   ├── AppError.js
│   ├── asyncHandler.js
│   ├── errorHandler.js
│   └── index.js
├── test/
├── examples/
│   └── server.js
├── package.json
├── README.md
└── LICENSE
```

## Testing

The project includes automated tests using Node.js's built-in test runner.

```bash
npm install
npm test
```

The test suite covers custom error creation, asynchronous error forwarding, response formatting, production message protection, and handling responses whose headers have already been sent.

## Independent Integration

The package is used in a separate HTML, CSS, JavaScript, and Express application deployed on Vercel.

**[View Demo Repository](https://github.com/maddikasirireddy/express-error-kit-web-demo)**

This demonstrates the complete workflow of building a reusable package, publishing it to NPM, installing it in another application, and exposing its functionality through a live interface.

## Limitations

- Intended for Express applications, not browser-side error handling
- CommonJS implementation
- No built-in request validation, error logging, or monitoring dashboard
- Does not automatically create errors for every unmatched route
- Applications must avoid placing sensitive information in client-facing custom errors

## License

MIT License.

## Author

**Maddika Siri Reddy**

[GitHub](https://github.com/maddikasirireddy) · [NPM](https://www.npmjs.com/~siriiiii)
