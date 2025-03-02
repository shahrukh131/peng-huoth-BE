const express = require("express");
const route = express.Router();

const { register, login } = require("@controllers/AuthController");
const userSchema = require("../validations/user");
const validateSchema = require("../middlewares/validateSchema");
const { initiateRegister } = require("../controllers/AuthController");
const validate = require("../utils/validate");
const userRegisterInitiateSchema = require("../validations/userRegisterInitiate");


route.post('/register',  validate(userSchema),register);
route.post('/register/initiate',  validate(userRegisterInitiateSchema),initiateRegister);
route.post('/login', login);

module.exports = route;
