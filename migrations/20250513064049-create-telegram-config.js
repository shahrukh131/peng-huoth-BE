'use strict';

const CoreEntity = require('../utils/core-entity');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TelegramConfigs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      bot_token: {
        type: Sequelize.STRING
      },
      chat_id: {
        type: Sequelize.STRING
      },
      ...CoreEntity(Sequelize),
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('TelegramConfigs');
  }
};