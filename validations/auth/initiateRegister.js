const Joi = require("joi");
const userRegisterInitiateSchema = Joi.object({
    staff_id: Joi.string().max(4).messages({
        'string.empty': 'Staff ID is required',
        'string.max': 'Staff ID must be at most 4 characters long'
    }),
    staff_name: Joi.string().messages({
        'string.empty': 'Name is required'
    }),
    email: Joi.string().email().required().messages({
        'string.empty': 'Email is required',
        'string.email': 'Email must be a valid email address'
    }),
    phoneNumber: Joi.string().pattern(/^[0-9]+$/).required().messages({
        'string.empty': 'Phone number is required',
        'string.pattern.base': 'Phone number must contain only digits'
    })
});

module.exports = userRegisterInitiateSchema;