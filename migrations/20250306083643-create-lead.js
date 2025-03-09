'use strict';

const CoreEntity = require('../utils/core-entity');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Leads', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      customer_name: {
        type: Sequelize.STRING
      },
      phone_number: {
        type: Sequelize.STRING
      },
      occupation_id: {
        type: Sequelize.INTEGER
      },
      gender:{
        type: Sequelize.ENUM('Male', 'Female', 'Other')
      },
      business_unit_id: {
        type: Sequelize.INTEGER
      },
      lead_status_id: {
        type: Sequelize.INTEGER
      },
      created_by_user_id: {
        type: Sequelize.INTEGER
      },
      ...CoreEntity(Sequelize),
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Leads');
  }
};