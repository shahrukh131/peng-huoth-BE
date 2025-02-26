const express = require("express");
const {
  save,
  findAllPaginatedUsers,
  findUserById,
  updateUser,
  deleteUser,
} = require("@controllers/UserController");
const validateSchema = require("../middlewares/validateSchema");
const route = express.Router();

// User Routes
route.route("/").get(findAllPaginatedUsers)
route.route("/:id").put(updateUser).get(findUserById).delete(deleteUser)


module.exports = route;