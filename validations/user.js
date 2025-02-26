const Joi = require('joi');

const userSchema = Joi.object({
    staff_id: Joi.string().min(4).max(20).required().messages({
    'string.min': 'Staff ID must be at least 4 characters long',
    'string.max': 'Staff ID must be at most 4 characters long',
    'any.required': 'Staff ID is required',
  }),
  staff_name: Joi.string().min(3).max(50).required().messages({
    'string.min': 'Name must be at least 3 characters long',
    'string.max': 'Name must be at most 50 characters long',
    'any.required': 'Name is required',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is required',
  }),
  phoneNumber: Joi.string()
    .required()
    .messages({
      'any.required': 'Phone number is required',
    }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required',
  }),
  isPhoneVerified: Joi.boolean().default(false), // Optional, default is false
});

module.exports = userSchema;