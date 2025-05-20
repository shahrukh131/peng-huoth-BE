const express = require("express");
const router = express.Router();
const { getNotifications, markAsRead, deleteNotification } = require("../controllers/NotificationController");
const authMiddleware = require("../middlewares/authMiddleware");

router.use(authMiddleware);
router.get("/", getNotifications);
router.put("/:id/read", markAsRead);
router.delete("/:id", deleteNotification);

module.exports = router;