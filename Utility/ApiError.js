class ApiError extends Error {
    /**
     * Custom API Error Handler
     * @param {number} statusCode - HTTP Status Code
     * @param {string} message - Error message
     * @param {Array} errors - Additional error details (optional)
     */
    constructor(statusCode = 500, message = "Something Went Wrong", errors = []) {
        super(message);
        this.statusCode = statusCode;
        this.success = false;
        this.errors = Array.isArray(errors) ? errors : [errors]; // Ensure it's always an array

        // Capture stack trace for better debugging (excluding constructor call)
        if (process.env.NODE_ENV !== 'production') {
            Error.captureStackTrace(this, this.constructor);
        }

    }
}

export default ApiError;
