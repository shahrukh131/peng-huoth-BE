'use strict';

const CoreEntity = require('../utils/core-entity');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Roles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      isActive: {
        type: Sequelize.BOOLEAN
      },
   
      ...CoreEntity(Sequelize),
    });
    //   // Optional: Seed initial roles
    await queryInterface.bulkInsert('Roles', [
      { name: 'admin', description: 'Administrator with full access' },
      { name: 'user', description: 'Regular user' }
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Roles');
  }
};