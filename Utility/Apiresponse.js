class ApiResponse {
	/**
	 * Standard API Response Object
	 * @param {number} statusCode - HTTP Status Code
	 * @param {any} data - Response Data
	 * @param {string} message - Response Message
	 */
	constructor(statusCode = 200, data = null, message = "Success") {
		this.statusCode = statusCode;
		this.success = statusCode >= 200 && statusCode < 300; // Automatically determines success
		this.message = message;
		this.data = data;
	}
}

export default ApiResponse;
