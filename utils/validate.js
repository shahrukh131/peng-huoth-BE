const sendResponse = require("./sendResponse");

const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        return sendResponse(res, 422, null, {
            name: "ValidationError",
            errors: error.details.map((err) => ({
                field: err.path.join('.'), // Converts array path to string
                message: err.message
            }))
        });
    }

    next(); // Proceed if validation passes
};

module.exports = validate;  