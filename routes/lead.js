const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const validateSchema = require("../middlewares/validateSchema");
const { save, findAllPaginatedLeads, findLeadById, updateLead, deleteLead, findAllLeadsByStatus, findAllLeadsByBusinessUnit } = require("../controllers/LeadController");
const route = express.Router();

// route.use(authMiddleware);

route.route("/").get(findAllPaginatedLeads).post(save);
route.route("/:id").get(findLeadById).put(updateLead).delete(deleteLead);
route.route("/lead-status/:statusId").get(findAllLeadsByStatus);
route.route("/business-unit/:businessUnitId").get(findAllLeadsByBusinessUnit);

module.exports = route;