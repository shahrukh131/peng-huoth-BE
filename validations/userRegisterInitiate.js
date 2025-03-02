const Joi = require("joi");

const userRegisterInitiateSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email(),
    phoneNumber: Joi.string().required(),
  });

module.exports = userRegisterInitiateSchema;