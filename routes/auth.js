const express = require("express");
const route = express.Router();

const { register, login } = require("@controllers/AuthController");
const userSchema = require("../validations/user");
const validateSchema = require("../middlewares/validateSchema");
const { initiateRegister, verifyOTP, completeRegistration, changePassword } = require("../controllers/AuthController");
const validate = require("../utils/validate");
const userRegisterInitiateSchema = require("../validations/auth/initiateRegister");
const limiter = require("../middlewares/rateLimiter");
const authMiddleware = require("../middlewares/authMiddleware");
const changePasswordSchema = require("../validations/changePassword");


// route.post('/register',  validate(userSchema),register);
route.post('/register/initiate', limiter, validate(userRegisterInitiateSchema),initiateRegister);
route.post('/register/verify-otp',verifyOTP);
route.post('/register/complete',completeRegistration);
route.post('/login', login);
route.put('/change-password',authMiddleware,validate(changePasswordSchema),changePassword );

module.exports = route;
