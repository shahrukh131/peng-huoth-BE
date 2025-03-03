const express = require("express");
const {
  save,
  findAllPaginatedUsers,
  findUserById,
  updateUser,
  deleteUser,
} = require("@controllers/UserController");
const validateSchema = require("../middlewares/validateSchema");
const { exportUser } = require("../controllers/UserController");
const route = express.Router();

// User Routes
route.route("/export").get(exportUser)
route.route("/").get(findAllPaginatedUsers)
route.route("/:id").put(updateUser).get(findUserById).delete(deleteUser)


module.exports = route;