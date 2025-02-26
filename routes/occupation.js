const express = require("express");
const {
  save,
  findAllOccupations,
  findOccupationById,
  updateOccupation,
  deleteOccupation,
} = require("@controllers/OccupationController");
const validateSchema = require("../middlewares/validateSchema");
const occupationSchema = require("../validations/occupation");
const route = express.Router();

// Occupations Routes
route.route("/").get(findAllOccupations).post( validateSchema(occupationSchema),save);
route.route("/:id").put(updateOccupation).get(findOccupationById).delete(deleteOccupation)


module.exports = route;