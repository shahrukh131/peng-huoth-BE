"use strict";

const CoreEntity = require("../utils/core-entity");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("LeadStatuses", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },
      ...CoreEntity(Sequelize),
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("LeadStatuses");
  },
};
