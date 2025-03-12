"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      "LeadStatuses",
      [
        {
          name: "Submitted",
          description: "Lead has been submitted by the user.",
          created_at: new Date(),
          updated_at: new Date(),
      
        },
        {
          name: "Customer Lead",
          description: "Lead has been recognized as a potential customer.",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Customer Feedback",
          description: "Lead has been converted into a customer.",
          created_at: new Date(),
          updated_at: new Date(),

        },
        {
          name: "Lead Conversion",
          description: "Lead has been converted into a customer.",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },
  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('LeadStatuses', null, {});
  },
};
