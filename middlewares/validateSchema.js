// middleware/validateSchema.js

const { Logger } = require("winston");
const logger = require("@utils/logger");

/**
 * Generic validation middleware
 * 
 * @param {Joi.Schema} schema - Joi schema to validate against
 * 
 * @description
 * This middleware validates the request body with the provided Joi schema.
 * If the validation fails, it returns a 422 status with the error details.
 * If the validation succeeds, it calls the next function.
 */
const validateSchema = (schema) => {
    return (req, res, next) => {
      const { error, value } = schema.validate(req.body, {
        abortEarly: false, // Include all validation errors
        allowUnknown: true, // Ignore unknown properties
        stripUnknown: true // Remove unknown properties
      });
  
      if (error) {
        logger.error('Validation error:', error);
        return res.status(422).json({
          message: 'Validation error',
          details: error.details.map((detail) => ({
            field: detail.path.join('.'),
            message: detail.message
          }))
        });
      
      }
  
      // Attach the validated data to the request object
      req.validatedData = value;
      next();
    };
  };
  
  module.exports = validateSchema;