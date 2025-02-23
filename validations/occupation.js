const Joi = require("joi");

const occupationSchema = Joi.object({
    name: Joi.string().min(3).required(),

  });
  
module.exports = occupationSchema;  