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
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7FoePMWa6ckvkLQ0AOgg3Nf91D58Qt5XDVdUsvDadbb4b8O5ROJxRmTqM8V2o2JKWUCE&usqp=CAU',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEJZGSyQCe0EEI0NNHjs8FnT4x0GFPhtKTWfbzCjQl_aO7GasXc87Qo5-X7YvNvEXj5mQ&usqp=CAU',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://www.luxuryhomemagazine.com/lhm_listings/73132/Strawberry-Park-001-(002)_-NEW1.jpg',
        preview: true
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
