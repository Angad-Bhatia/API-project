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
        state: 'NJ',
        country: 'United States',
        lat: -90,
        lng: 180,
        name: 'Banana Beach House',
        description: 'Best place in the world. House has a good wi-fi connection. The beach is a 3 minute walk away',
        price: 300.01
      },
      {
        ownerId: 3,
        address: '1900 California Ave',
        city: 'Richmond',
        state: 'VA',
        country: 'United States',
        lat: -20,
        lng: 150,
        name: 'Apple Farm Cottage',
        description: 'The place has 3 bedrooms and 3 bathrooms. The wi-fi supports a limited number of devices, but there is about 2 acres of open grass in the backyard.',
        price: 10000000.01
      },
      {
        ownerId: 3,
        address: '36 Allerton Rd',
        city: 'Pittsburgh',
        state: 'PA',
        country: 'United States',
        lat: 70,
        lng: -180,
        name: 'Strawberry Land',
        description: 'The location includes 2 bedrooms and one and a half bathrooms. A TV is in the living room. There is also a ping-pong table, as well as a pool table.',
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
