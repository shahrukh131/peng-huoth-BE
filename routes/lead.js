const express = require("express");
const {
  save,
  findAllPaginatedLeads,
  findLeadById,
  updateLead,
  deleteLead,
  findAllLeadsByStatus,
  findAllLeadsByBusinessUnit,
  getLeadCount,
  getLeadStatusCountByBusinessUnit,
  getLeadByBuAndStatus,
} = require("../controllers/LeadController");
const authMiddleware = require("../middlewares/authMiddleware");
const route = express.Router();

// route.use(authMiddleware);

route.route("/count").get(getLeadCount);
route.route("/").get(findAllPaginatedLeads).post(authMiddleware,save);
route.route("/:id").get(findLeadById).put(authMiddleware,updateLead).delete(deleteLead);
route.route("/lead-status/:statusId").get(findAllLeadsByStatus);
route.route("/business-unit/:businessUnitId").get(findAllLeadsByBusinessUnit);
route.route("/stats/:businessUnitId").get(getLeadStatusCountByBusinessUnit);
route.route("/leadbystatus/:businessUnitId/:statusId").get(getLeadByBuAndStatus);

module.exports = route;
