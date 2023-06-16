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
        city: 'Parsippany',
        state: 'NJ',
        country: 'United States',
        lat: -90,
        lng: 180,
        name: 'Banana Beach House',
        description: 'Best place in the world',
        price: 300.01
      },
      {
        ownerId: 3,
        address: '1600 Pennsylvania Ave',
        city: 'Richmond',
        state: 'VA',
        country: 'United States',
        lat: -20,
        lng: 150,
        name: 'Apple Farm Cottage',
        description: 'Management is terrible here',
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
        description: 'I have seen better',
        price: 300.21
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op
    await queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Banana Beach House', 'Apple Farm Cottage', 'Strawberry Land'] }
    }, {});
  }
};
