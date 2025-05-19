const express = require("express");
const router = express.Router();

const occupationRoutes = require("./occupation");
const userRoutes = require("./user");
const authRoutes = require("./auth");
const leadRoutes = require("./lead");
const telegramConfigRoutes = require("./telegramConfig");
const notificationRoutes = require("./notification");


router.use("/occupations", occupationRoutes);
router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/lead", leadRoutes);
router.use("/telegram-config", telegramConfigRoutes);
router.use("/notifications", notificationRoutes);

module.exports = router;
