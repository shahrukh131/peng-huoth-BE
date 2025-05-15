const Joi = require("joi");

const changePasswordSchema = Joi.object({
    // current password and new password are required also add messages
    currentPassword: Joi.string().required().messages({
        "any.required": "Current password is required",
    }),
    newPassword: Joi.string().required().messages({
        "any.required": "New password is required",
    }),
    confirmPassword: Joi.string().required().valid(Joi.ref('newPassword')).messages({
        "any.required": "Confirm password is required",
        "any.only": "Confirm password must match new password",
    }),
})

module.exports = changePasswordSchema;