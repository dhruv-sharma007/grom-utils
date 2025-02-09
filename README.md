# grom-utils

A utility package for Express.js applications offering simplified async handling, error responses, validation, rate limiting, and logging.

## 🚀 Overview

Grom is a powerful utility package designed to enhance Express.js applications by providing a standardized approach to error handling, input validation, rate limiting, structured responses, and logging. It simplifies backend development by enforcing best practices and reducing boilerplate code.

## ❓ Problem Statement

Developers often face repetitive tasks in Express.js applications, such as:

- Handling async errors properly.
- Validating user input against expected schemas.
- Preventing API abuse with rate limiting.
- Standardizing API responses.
- Implementing structured logging.

Grom solves these problems by offering a robust, modular utility class that integrates seamlessly into Express.js applications.

## 📦 Installation

```bash
npm install grom-utils
```

## Features

- **Async Handler**: Wrap async functions to catch errors.
- **Error Checker**: Throw custom API errors with ease.
- **API Responses**: Standard and paginated API responses.
- **Input Validation**: Schema-based input validation.
- **Rate Limiting**: Simple middleware to limit requests per IP.
- **Logging**: Colorful, timestamped logs.

## 🛠 Usage

### 1. Async Error Handling (grAsyncHandler)

**Problem**: Handling errors in async Express.js routes requires repetitive try-catch blocks.

**Solution**: Grom wraps async functions to automatically catch errors and forward them to Express middleware.

**Example**:

```javascript
import { grAsyncHandler } from "grom-utils";

app.get("/data", grAsyncHandler(async (req, res) => {
    const data = await fetchData(); // Assume async function
    res.json({ success: true, data });
}));
```

### 2. Schema-Based Input Validation (grValidate)

**Problem**: Manually checking request payloads for type mismatches is tedious and error-prone.

**Solution**: Grom validates data against a predefined schema and throws an error if mismatched.

**Example**:

```javascript
import { grValidate } from "grom-utils";

const userSchema = { name: "string", age: "number" };

app.post("/register", (req, res) => {
    grValidate(userSchema, req.body);
    res.json({ message: "User registered successfully" });
});
```

### 3. API Response Standardization (grResponse)

**Problem**: API responses often lack consistency in structure and formatting.

**Solution**: Grom provides a standard response format with status codes, messages, and metadata.

**Example**:

```javascript
import { grResponse } from "grom-utils";

app.get("/status", (req, res) => {
    res.json(grResponse(200, { status: "OK" }, "Service is running"));
});
```

### 4. Custom Error Checking (grCheck)

**Problem**: Developers often need to enforce custom conditions before proceeding.

**Solution**: Grom throws an API error if a condition is false.

**Example**:

```javascript
import { grCheck } from "grom-utils";

app.post("/order", (req, res) => {
    grCheck(req.body.items.length > 0, 400, "Order cannot be empty");
    res.json({ message: "Order placed successfully" });
});
```

### 5. Rate Limiting Middleware (grRateLimit)

**Problem**: APIs are vulnerable to abuse through excessive requests.

**Solution**: Grom limits requests per IP address within a specified time window.

**Example**:

```javascript
import { grRateLimit } from "grom-utils";

app.use(grRateLimit(5, 10000)); // Max 5 requests per 10 sec
```

### 6. Structured Logging (grLogger)

**Problem**: Logs are often unstructured, making debugging difficult.

**Solution**: Grom provides color-coded logs with timestamps.

**Example**:

```javascript
import { grLogger } from "grom-utils";

grLogger("info", "Server started on port 3000");
```

## Functions

- `grAsyncHandler`
- `grCheck`
- `grResponse`
- `grValidate`
- `grRateLimit`
- `grLogger`

## 🎯 Why Use Grom?

- ✅ Reduces repetitive boilerplate code.
- ✅ Improves API security and reliability.
- ✅ Enforces best practices in Express.js.
- ✅ Easy integration into existing projects.

## 📜 License

MIT License


## 📞 Support

For issues and feature requests, open an issue on GitHub.

Dhruv Sharma ([[@dhruv-sharma007](https://github.com/dhruv-sharma007)])


## 👥 Contributors

Become contributor in this project