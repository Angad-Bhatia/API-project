'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    await queryInterface.bulkInsert(options, [
      {
        ownerId: 3,
        address: '3 Condit Ave',
        city: 'Whippany',
        state: 'New Jersey',
        country: 'United States of America',
        lat: -90,
        lng: 180,
        name: 'Banana Beach House',
        description: 'House has a good wi-fi connection. The beach is 3 minutes away',
        price: 300.01
      },
      {
        ownerId: 3,
        address: '1900 California Ave',
        city: 'Richmond',
        state: 'Virginia',
        country: 'United States of America',
        lat: -20,
        lng: 150,
        name: 'Apple Farm Cottage',
        description: '3 bedrooms and 3 bathrooms. 2 acres in the backyard.',
        price: 10000000.01
      },
      {
        ownerId: 3,
        address: '36 Allerton Rd',
        city: 'Pittsburgh',
        state: 'Pennsylvania',
        country: 'United States of America',
        lat: 70,
        lng: -180,
        name: 'Strawberry Land',
        description: 'There is a ping-pong table and a pool table.',
        price: 300.21
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      // name: { [Op.in]: ['Banana Beach House', 'Apple Farm Cottage', 'Strawberry Land'] }
    });
  }
};
