'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    await queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        url: 'https://shorturl.at/aALT0',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://shorturl.at/rIUW0',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://shorturl.at/jnFG6',
        preview: false
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      // url: { [Op.in]: ['https://shorturl.at/aALT0', 'https://shorturl.at/rIUW0', 'https://shorturl.at/jnFG6'] }
    });
  }
};
