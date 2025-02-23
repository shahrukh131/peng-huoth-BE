const express = require("express");
const router = express.Router();


const occupationRoutes = require("./occupation");
router.use("/occupations", occupationRoutes);

module.exports = router;