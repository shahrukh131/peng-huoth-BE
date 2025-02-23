const express = require("express");
const {
  save,
  findAllBooks,
  findAllOccupations,
  findBookById,
  updateBook,
  deleteBook,
} = require("@controllers/OccupationController");
const validateSchema = require("../middlewares/validateSchema");
const occupationSchema = require("../validations/occupation");
const route = express.Router();

// Occupations Routes
route.route("/").get(findAllOccupations).post( validateSchema(occupationSchema),save);
// route.route("/:id").put(updateBook).get(findBookById).delete(deleteBook)


module.exports = route;