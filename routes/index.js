const express = require("express");
const router = express.Router();

const occupationRoutes = require("./occupation");
const userRoutes = require("./user");
const authRoutes = require("./auth");


router.use("/occupations", occupationRoutes);
router.use("/users", userRoutes);
router.use("/auth", authRoutes);

module.exports = router;
