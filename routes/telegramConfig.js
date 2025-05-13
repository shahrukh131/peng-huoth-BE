const express = require("express");
const router = express.Router();
const {
  getTelegramConfig,
  createOrReplaceTelegramConfig,
} = require("../controllers/TelegramConfigController");
const isAdmin = require("../middlewares/isAdmin");
const authMiddleware = require("../middlewares/authMiddleware");

// router.use(authMiddleware);
router.get("/", getTelegramConfig);
router.post("/",authMiddleware,isAdmin, createOrReplaceTelegramConfig);
module.exports = router;
