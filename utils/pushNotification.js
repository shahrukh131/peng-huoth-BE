const admin = require('firebase-admin');

/**
 * Send a push notification to a device
 * @param {string} token - Device token
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @returns {Promise<Object>}
 */
const sendPushNotification = async (token, title, body) => {
  if (!token) {
    console.error("Device token is required.");
    return { success: false, error: "Device token is required" };
  }

  const message = {
    notification: { title, body },
    token,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('Push notification sent successfully:', response);
    return { success: true, response };
  } catch (error) {
    console.error('Error sending push notification:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendPushNotification };