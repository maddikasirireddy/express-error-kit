# Express Error Kit

A lightweight, reusable **Node.js package for centralized error handling in Express.js applications**.

[![npm version](https://img.shields.io/npm/v/express-error-kit-siri)](https://www.npmjs.com/package/express-error-kit-siri)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Overview

Express Error Kit simplifies error handling in Express 4 and Express 5 applications. It provides reusable utilities for creating custom errors, catching asynchronous errors, and returning consistent JSON error responses.

**NPM Package:** [express-error-kit-siri](https://www.npmjs.com/package/express-error-kit-siri)

**GitHub Repository:** [express-error-kit](https://github.com/maddikasirireddy/express-error-kit)

**Demo Project:** [express-error-kit-demo](https://github.com/maddikasirireddy/express-error-kit-demo)

## Features

- Centralized error handling for Express applications
- Custom HTTP error messages and status codes
- Support for application-specific error codes
- Automatic forwarding of asynchronous errors
- Consistent JSON error responses
- Hides internal server error messages in production
- Compatible with Express 4 and Express 5
- Lightweight CommonJS package
- No required runtime dependencies beyond the Express application

## Installation

Install the package using NPM:

```bash
npm install express-error-kit-siri
```

For a new Express project, install Express as well:

```bash
npm install express express-error-kit-siri
```

**Requirements:**
- Node.js 18 or later
- Express.js 4.18+ or 5.x

## Quick Start

Create a file named `server.js`:

```javascript
const express = require("express");

const {
  AppError,
  asyncHandler,
  errorHandler
} = require("express-error-kit-siri");

const app = express();

app.use(express.json());

// Sample data
const users = [
  { id: 1, name: "Siri" },
  { id: 2, name: "Alex" }
];

// Successful request or custom error
app.get("/users/:id", asyncHandler(async (req, res) => {
  const user = users.find(
    u => u.id === Number(req.params.id)
  );

  if (!user) {
    throw new AppError(
      "User not found",
      404,
      "USER_NOT_FOUND"
    );
  }

  res.json({
    success: true,
    data: user
  });
}));

// Example asynchronous error
app.get("/server-error", asyncHandler(async () => {
  throw new Error("Unexpected database failure");
}));

// Register error middleware after routes
app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
```

Start the server:

```bash
node server.js
```

## Example API Responses

### 1. Successful Request

**GET** `/users/1`

HTTP Status: `200 OK`

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Siri"
  }
}
```

### 2. User Not Found

**GET** `/users/99`

HTTP Status: `404 Not Found`

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

### 3. Internal Server Error

**GET** `/server-error`

In production mode, the package hides internal error details.

HTTP Status: `500 Internal Server Error`

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

The exact error code for unexpected errors depends on the package implementation.

## API Documentation

### 1. AppError

Creates a custom application error with an HTTP status code and an optional application-specific error code.

**Syntax:**

```javascript
new AppError(message, statusCode, code);
```

**Parameters:**

| Parameter | Type | Description | Default |
|---|---|---|---|
| message | String | Error description | Required |
| statusCode | Number | HTTP status code | 500 |
| code | String | Application error identifier | APP_ERROR |

**Example:**

```javascript
throw new AppError(
  "Access denied",
  403,
  "ACCESS_DENIED"
);
```

**Return Value:** An Error object containing `message`, `statusCode`, and `code`.

### 2. asyncHandler

Wraps an asynchronous Express route or middleware function and forwards rejected promises and thrown errors to Express error middleware.

**Syntax:**

```javascript
asyncHandler(fn);
```

**Parameter:**

`fn` — An Express route handler or middleware function.

**Example:**

```javascript
app.get("/data", asyncHandler(async (req, res) => {
  const data = await fetchData();
  res.json(data);
}));
```

**Return Value:** An Express-compatible middleware function.

**Benefit:** Reduces repetitive error-forwarding logic in asynchronous routes.

Express 5 already forwards rejected promises automatically, but this helper remains useful for Express 4 compatibility.

### 3. errorHandler

Centralized Express error-handling middleware that formats errors into JSON responses.

**Syntax:**

```javascript
app.use(errorHandler);
```

**Parameters:**

| Parameter | Description |
|---|---|
| err | Error object |
| req | Express request |
| res | Express response |
| next | Express next middleware function |

**Behavior:**

- Uses an appropriate HTTP status code
- Returns a consistent JSON error structure
- Hides internal server error messages in production
- Delegates errors when response headers have already been sent

**Important:** Register this middleware after all application routes.

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
├── LICENSE
└── .gitignore
```

## Testing

The package uses Node.js's built-in test runner.

To run the automated tests:

```bash
npm test
```

The test suite covers:

- Custom error creation
- Asynchronous error forwarding
- Error response formatting
- Production error-message protection
- Handling responses whose headers have already been sent
- Normalization of invalid HTTP status codes

**Test Results:** 7 tests passed, 0 failed.

To preview the NPM package contents:

```bash
npm pack --dry-run
```

## Real-World Integration Demo

A separate Express application demonstrates installation and usage of this package.

**Repository:** https://github.com/maddikasirireddy/express-error-kit-demo

The demo includes endpoints for:

| Endpoint | Purpose | HTTP Status |
|---|---|---|
| `/users/1` | Successful API response | 200 |
| `/users/99` | Custom application error | 404 |
| `/server-error` | Unexpected server error | 500 |

This demonstrates that the package can be installed and reused in an independent Node.js project.

## Versioning

The package follows Semantic Versioning:

`MAJOR.MINOR.PATCH`

- **MAJOR:** Breaking API changes
- **MINOR:** Backward-compatible new features
- **PATCH:** Bug fixes and documentation corrections

Published versions can be viewed on [NPM](https://www.npmjs.com/package/express-error-kit-siri?activeTab=versions).

## Limitations

- Designed specifically for Express applications.
- Uses CommonJS; ESM applications can import the CommonJS module.
- Does not provide built-in logging or request validation.
- Does not replace application-level authentication or authorization.
- Custom error messages should not contain confidential information.
- `AppError` does not validate constructor arguments; callers should provide valid HTTP status codes.

## Contributing

Contributions and suggestions are welcome.

1. Fork the repository.
2. Create a new feature branch.
3. Make your changes.
4. Add or update relevant tests.
5. Run `npm test`.
6. Submit a pull request describing your changes.

Issues and feature suggestions can be submitted through the GitHub repository.

## License

This project is licensed under the MIT License.

## Author

**Maddika Siri Reddy**

GitHub: [maddikasirireddy](https://github.com/maddikasirireddy)

NPM: [siriiiii](https://www.npmjs.com/~siriiiii)