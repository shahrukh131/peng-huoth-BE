const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const validateSchema = require("../middlewares/validateSchema");
const { save, findAllPaginatedLeads } = require("../controllers/LeadController");
const route = express.Router();

// route.use(authMiddleware);

route.route("/").get(findAllPaginatedLeads).post(save);

module.exports = route;