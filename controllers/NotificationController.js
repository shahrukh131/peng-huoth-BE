const { Notification, Lead, User,BusinessUnit,LeadStatus } = require("@models");
const sendResponse = require("@utils/sendResponse");

const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from JWT token
    const notifications = await Notification.findAll({
      where: { user_id: userId },
      order: [["created_at", "DESC"]]
    });

    sendResponse(res, 200, notifications);
  } catch (error) {
    sendResponse(res, 500, null, error.message);
  }
};

const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await Notification.update(
      { is_read: true },
      { where: { id, user_id: userId }, limit: 1 }
    );
     sendResponse(res, 200, null, null, " updated successfully");
  } catch (error) {
    console.log(error);
    
    sendResponse(res, 500, null, error.message);
  }
};

// notification delete
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await Notification.destroy({
      where: { id, user_id: userId },
    });

    sendResponse(res, 200, null, "Notification deleted successfully");
  } catch (error) {
    sendResponse(res, 500, null, error.message);
  }
};

module.exports = { getNotifications, markAsRead,deleteNotification };