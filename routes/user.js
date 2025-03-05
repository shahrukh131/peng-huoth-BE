const express = require("express");
const {
  save,
  findAllPaginatedUsers,
  findAllUsers,
  findUserById,
  updateUser,
  deleteUser,
} = require("@controllers/UserController");
const validateSchema = require("../middlewares/validateSchema");
const { exportUser } = require("../controllers/UserController");
const multer = require("multer");
const route = express.Router();

// Set up multer for handling file uploads
const upload = multer({ dest: "uploads/" });

// User Routes
route.route("/export").get(exportUser);
route.route("/").get(findAllPaginatedUsers);
route.route("/:id")
.put(upload.single('profile_image'), updateUser)
.get(findUserById)
.delete(deleteUser);

module.exports = route;
