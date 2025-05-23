/**
 * Reusable function to send standardized API responses
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {Object} [data] - Optional data to include in the response
 * @param {Object} [error] - Optional error details
 * @param {string} [customMessage] - Optional custom message to override the default
 */
function sendResponse(
  res,
  statusCode,
  data = null,
  error = null,
  customMessage = null
) {
  // Map status codes to their corresponding default messages
  const statusMessages = {
    200: "Data retrieved successfully",
    201: "Data created successfully",
    204: "No content",
    400: "Bad request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Resource not found",
    422: "Validation error",
    500: "Internal server error",
    429: "Too many requests",
  };

  const message =
    customMessage || statusMessages[statusCode] || "Unknown status";

  const response = {
    success: statusCode >= 200 && statusCode < 300,
    message: message,
  };

  if (data !== null) {
    if (Array.isArray(data) && data.length === 1) {
      response.data = data[0];
    } else {
      response.data = data;
    }
  }
  if (error) {
    if (
      error.name === "SequelizeValidationError" ||
      error.name === "SequelizeUniqueConstraintError"
    ) {
      statusCode = 422;
      response.success = false;
      response.message = "Validation error";
      response.errors = error.errors.map((err) => ({
        field: err.path,
        message: err.message,
      }));
    } else if (error.name === "ValidationError") {
      statusCode = 422;
      response.success = false;
      response.message = "Validation error";
      response.errors = error.errors; // Joi errors are already formatted
    } else {
      response.error = error.message || error;
    }
  }

  res.status(statusCode).json(response);
}

module.exports = sendResponse;
