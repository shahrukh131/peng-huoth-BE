require('dotenv').config();

const telegramConfig = {
  BOT_TOKEN:'8090911281:AAExxDME5QNOiXRWVZcHtO_QfL0n9F33oa4',
  CHAT_ID: '-1002600392570',
  validateConfig: function() {
    if (!this.BOT_TOKEN || !this.CHAT_ID) {
      console.error('Telegram configuration is incomplete. Check your environment variables.');
      return false;
    }
    return true;
  }
};

module.exports = telegramConfig;