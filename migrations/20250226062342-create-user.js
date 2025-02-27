'use strict';

const CoreEntity = require('../utils/core-entity');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
   
      staff_id: {
        type: Sequelize.STRING,
        unique: true
      },
      staff_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING
      },
      phoneNumber: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      isPhoneVerfied: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      ...CoreEntity(Sequelize),
     
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};