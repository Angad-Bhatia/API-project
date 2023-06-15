'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    await queryInterface.bulkInsert(options, [
      {
        reviewId: 1,
        url: 'https://shorturl.at/bjzMN'
      },
      {
        reviewId: 2,
        url: 'https://shorturl.at/pFKM0'
      },
      {
        reviewId: 3,
        url: 'https://shorturl.at/jGNR8'
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      url: { [Op.in]: ['https://shorturl.at/bjzMN','https://shorturl.at/pFKM0','https://shorturl.at/jGNR8'] }
    }, {});
  }
};
