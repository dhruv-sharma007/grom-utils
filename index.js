import ApiResponse from "./Utility/Apiresponse.js";
import ApiError from "./Utility/ApiError.js";

class Grom {
  constructor() {
    // Map to store rate limit logs per IP
    this.rateLimits = new Map();
  }

  /**
   * Wraps an async function to catch errors and delegate to Express error middleware.
   * @param {Function} fn - The async route handler.
   * @returns {Function}
   */
  grAsyncHandler(fn) {
    return async (req, res, next) => {
      try {
        await fn(req, res, next);
      } catch (error) {
        next(error);
      }
    };
  }

  /**
   * Checks a condition; if false, throws an ApiError.
   * @param {boolean} condition - The condition to check.
   * @param {number} [statusCode=400] - HTTP status code.
   * @param {string} [message="Bad Request"] - Error message.
   */
  grCheck(condition, statusCode = 400, message = "Bad Request") {
    if (!condition) {
      throw new ApiError(statusCode, message);
    }
  }

  /**
   * Generates a standard API response.
   * @param {number} [statusCode=200] - HTTP status code.
   * @param {any} [data=null] - Data to return.
   * @param {string} [message="Success"] - Response message.
   * @param {object} [meta={}] - Additional meta information (e.g., pagination).
   * @returns {ApiResponse}
   */
  grResponse(statusCode = 200, data = null, message = "Success", meta = {}) {
    return new ApiResponse(statusCode, data, message, meta);
  }

  /**
   * Validates input data against a simple schema.
   * @param {object} schema - Expected keys and their types (e.g., { name: "string", age: "number" }).
   * @param {object} data - Actual data to validate.
   * @throws {ApiError} - If validation fails.
   */
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

  /**
   * Express middleware for rate limiting based on IP address.
   * @param {number} maxRequests - Maximum allowed requests.
   * @param {number} timeWindow - Time window in milliseconds.
   * @returns {Function} Express middleware.
   */
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

  /**
   * Logs messages with a timestamp and color-coded levels.
   * @param {string} level - Log level ("info", "warn", or "error").
   * @param {string} message - The message to log.
   */
  grLogger(level, message) {
    const colors = { info: "\x1b[36m", warn: "\x1b[33m", error: "\x1b[31m" };
    const timestamp = new Date().toISOString();
    console.log(`${colors[level] || ""}[${level.toUpperCase()}] ${timestamp}: ${message}\x1b[0m`);
  }
}

export default Grom;
