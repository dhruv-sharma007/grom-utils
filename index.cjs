const ApiResponse = require("./Utility/ApiResponse.cjs");
const ApiError = require("./Utility/ApiError.cjs");

class Grom {
  constructor() {
    this.rateLimits = new Map();
  }

  grAsyncHandler(fn) {
    return async (req, res, next) => {
      try {
        await fn(req, res, next);
      } catch (error) {
        next(error);
      }
    };
  }

  grCheck(condition, statusCode = 400, message = "Bad Request") {
    if (!condition) {
      throw new ApiError(statusCode, message);
    }
  }

  grResponse(statusCode = 200, data = null, message = "Success", meta = {}) {
    return new ApiResponse(statusCode, data, message, meta);
  }

  grValidate(schema, data) {
    const errors = [];
    for (const key in schema) {
      const expectedType = schema[key];
      if (typeof data[key] !== expectedType) {
        errors.push(`'${key}' should be of type '${expectedType}', got '${typeof data[key]}'`);
      }
    }
    if (errors.length) {
      throw new ApiError(400, "Validation Error", errors);
    }
  }

  grRateLimit(maxRequests, timeWindow) {
    return (req, res, next) => {
      const ip = req.ip;
      const now = Date.now();
      const requestLogs = this.rateLimits.get(ip) || [];
      const filteredLogs = requestLogs.filter(timestamp => now - timestamp < timeWindow);
      filteredLogs.push(now);
      this.rateLimits.set(ip, filteredLogs);

      if (filteredLogs.length > maxRequests) {
        return next(new ApiError(429, "Too many requests, slow down!"));
      }
      next();
    };
  }

  grLogger(level, message) {
    const colors = { info: "\x1b[36m", warn: "\x1b[33m", error: "\x1b[31m" };
    const timestamp = new Date().toISOString();
    console.log(`${colors[level] || ""}[${level.toUpperCase()}] ${timestamp}: ${message}\x1b[0m`);
  }
}

module.exports = Grom;
