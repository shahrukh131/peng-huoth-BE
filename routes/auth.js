const express = require("express");
const route = express.Router();

const { register, login } = require("@controllers/AuthController");
const userSchema = require("../validations/user");
const validateSchema = require("../middlewares/validateSchema");


route.post('/register',  validateSchema(userSchema),register);
route.post('/login', login);

module.exports = route;
