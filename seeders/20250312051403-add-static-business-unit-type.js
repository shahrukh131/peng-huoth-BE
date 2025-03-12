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
      "BusinessUnits",
      [
        {
          name: "Borey",
          description:
            '"Borey" refers to a gated community or residential development, and Borey business units are the specific houses or apartments within those developments, catering to a variety of price points and amenities',
          created_at: new Date(),
          updated_at: new Date(),
          created_by_email: "sony@gmail.com",
          created_by_dn: "sony",
        },
        {
          name: "PH Grandhall",
          description: "PH Grandhall Description",
          created_at: new Date(),
          updated_at: new Date(),
          created_by_email: "sony@gmail.com",
          created_by_dn: "sony",
        },
        {
          name: "Leasing",
          description: "Leasing Description",
          created_at: new Date(),
          updated_at: new Date(),
          created_by_email: "sony@gmail.com",
          created_by_dn: "sony",
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
    await queryInterface.bulkDelete('BusinessUnits', null, {});
  },
};
