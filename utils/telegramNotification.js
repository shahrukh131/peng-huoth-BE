const TelegramBot = require("node-telegram-bot-api");
require('dotenv').config();
const telegramConfig = require("../config/telegramConfig.js");

// Initialize bot with your token


const TELEGRAM_BOT_TOKEN = '8090911281:AAExxDME5QNOiXRWVZcHtO_QfL0n9F33oa4';
// Replace with your team's chat ID
const TELEGRAM_CHAT_ID = '-1002600392570';

// Validate bot token and chat ID
let bot;
try {
  if (telegramConfig.validateConfig()) {
    bot = new TelegramBot(telegramConfig.BOT_TOKEN, { polling: false });
  }
} catch (error) {
  console.error('Failed to initialize Telegram bot:', error);
}

const sendLeadNotification = async (lead, action = "created") => {
  try {
    const message = `
🔔 Lead ${action.toUpperCase()}

👤 Customer: ${lead.customer_name}
📞 Phone: ${lead.phone_number}
🏢 Business Unit: ${lead.BusinessUnit?.name || "N/A"}
📋 Status: ${lead.LeadStatus?.name || "N/A"}
👔 Occupation: ${lead.Occupation?.name || "N/A"}
📝 Remarks: ${lead.remarks || "N/A"}

Created by: ${lead.created_by_dn}
Created by Email: ${lead.created_by_email}
${action === "updated" ? `Updated by: ${lead.updated_by_dn}` : ""}
${action === "updated" ? `Updated by Email: ${lead.updated_by_email}` : ""}
        `;
    await bot.sendMessage(telegramConfig.CHAT_ID, message);
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = {
  sendLeadNotification,
};
