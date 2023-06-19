'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    await queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 1,
        startDate: '2023-06-12',
        endDate: '2023-06-18'
      },
      {
        spotId: 2,
        userId: 2,
        startDate: '2024-01-01',
        endDate: '2024-01-08'
      },
      {
        spotId: 3,
        userId: 3,
        startDate: '2026-12-28',
        endDate: '2026-12-30'
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      // startDate: { [Op.in]: ['2023-06-12', '2024-01-01', '2026-12-28'] }
    });
  }
};
