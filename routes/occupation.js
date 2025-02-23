const express = require("express");
const {
  save,
  findAllBooks,
  findAllOccupations,
  findBookById,
  updateBook,
  deleteBook,
} = require("@controllers/OccupationController");
const route = express.Router();

// Occupations Routes
route.route("/").get(findAllOccupations) 
// route.route("/:id").put(updateBook).get(findBookById).delete(deleteBook)


module.exports = route;