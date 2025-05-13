const { TelegramConfig } = require("@models");
const sendResponse = require("@utils/sendResponse");
const { createData } = require("../utils/GenericMethods");

const getTelegramConfig = async (req, res) => {
  try {
    const config = await TelegramConfig.findOne();
    if (!config) {
      return sendResponse(res, 404, null, "Telegram configuration not found");
    }
    sendResponse(res, 200, config);
  } catch (error) {
    sendResponse(res, 400, null, error);
  }
}
const createOrReplaceTelegramConfig = async (req, res) => {
  try {
   
    await TelegramConfig.destroy({ where: {} });

    // Create new config
    const { bot_token, chat_id } = req.body;
     const [config] = await TelegramConfig.upsert(
      { id: 1, bot_token, chat_id },
      { returning: true }
    );

    sendResponse(res, 201, config, null, "Telegram config saved");
  } catch (error) {
    sendResponse(res, 500, null, error.message);
  }
};

module.exports = { getTelegramConfig,createOrReplaceTelegramConfig };