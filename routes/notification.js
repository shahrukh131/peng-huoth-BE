const express = require("express");
const router = express.Router();
const { getNotifications, markAsRead } = require("../controllers/NotificationController");
const authMiddleware = require("../middlewares/authMiddleware");

router.use(authMiddleware);
router.get("/", getNotifications);
router.put("/:id/read", markAsRead);

module.exports = router;