require('dotenv').config();
const { TelegramConfig } = require("@models");
// const telegramConfig = {
//   BOT_TOKEN:'8090911281:AAExxDME5QNOiXRWVZcHtO_QfL0n9F33oa4',
//   CHAT_ID: '-1002600392570',
//   validateConfig: function() {
//     if (!this.BOT_TOKEN || !this.CHAT_ID) {
//       console.error('Telegram configuration is incomplete. Check your environment variables.');
//       return false;
//     }
//     return true;
//   }
// };

const telegramConfig = {
  async getConfig() {
    const config = await TelegramConfig.findOne();
    console.log("Telegram Config:", config.bot_token, config.chat_id);
    
    if (!config || !config.bot_token || !config.chat_id) {
      throw new Error("Telegram configuration is incomplete in the database.");
    }
    return {
      BOT_TOKEN: config.bot_token,
      CHAT_ID: config.chat_id,
    };
  },
   async validateConfig() {
    try {
      await this.getConfig();
      return true;
    } catch (err) {
      console.error('Telegram configuration is incomplete. Check your database.');
      return false;
    }
  }
};

module.exports = telegramConfig;