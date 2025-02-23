// Import the sendResponse function from another file
const { sendResponse } = require('@utils/sendResponse.js');
const logger = require('../utils/logger');

/**
 * Global error handler middleware
 * @param {Error} err - The error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
function globalErrorHandler(err, req, res, next) {
    console.error('Global Error Handler:', err);
    logger.error(err.message);

    // Default status code for unexpected errors
    const statusCode = err.statusCode || 500;

    // Default error message
    const message = err.message || 'Internal Server Error';

    // Send the error response using the reusable sendResponse function
    sendResponse(res, statusCode, null, message);
}

const notFoundMiddleware = (req, res, next) => {
    res.status(404).json({
      message: 'No API found',
      status: 404,
      error: 'Not Found',
    });
    
  };

module.exports = {
    globalErrorHandler,
    notFoundMiddleware
};