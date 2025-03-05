const rateLimiter = require('express-rate-limit');


const limiter = rateLimiter({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 10, // limit each IP to 10 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
        success: false,
        message: "Too many requests, please try again later",
    },
    handler: (req, res, next) => {
        res.status(429).json({
            success: false,
            message: "Too many requests, please try again later",
        });
    },
  });

module.exports = limiter;