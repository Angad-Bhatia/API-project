'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    await queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 1,
        review: 'I love this place',
        stars: 5
      },
      {
        spotId: 2,
        userId: 2,
        review: 'It stinks',
        stars: 2
      },
      {
        spotId: 3,
        userId: 3,
        review: 'Never again',
        stars: 1
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      // review: { [Op.in]: ['I love this place', 'It stinks', 'Never again'] }
    });
  }
};
