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
        price: 300
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
        price: 200
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
        price: 300
      },
      {
        ownerId: 3,
        address: '36 Neymar Rd',
        city: 'Pittsburgh',
        state: 'Pennsylvania',
        country: 'United States of America',
        lat: 70,
        lng: -180,
        name: 'Popsicle',
        description: 'It is an absolutely lavish place to stay at',
        price: 420
      },
      {
        ownerId: 3,
        address: '40 Carpenter Rd',
        city: 'Omaha',
        state: 'Idaho',
        country: 'United States of America',
        lat: 70,
        lng: -180,
        name: 'Peach Circuit',
        description: 'Big suite, with a lot of fun amenities',
        price: 309
      },
      {
        ownerId: 3,
        address: '50 Prince Rd',
        city: 'Pierre',
        state: 'North Dakota',
        country: 'United States of America',
        lat: 70,
        lng: -180,
        name: 'Belly Flop',
        description: 'The biggest pool you will ever see is here.',
        price: 500
      },
      {
        ownerId: 3,
        address: '45 Albany Ln',
        city: 'Albany',
        state: 'NY',
        country: 'United States of America',
        lat: 70,
        lng: -180,
        name: 'Banana Shortcut',
        description: '4 Bedrooms and 2 full bathrooms. There is a washer-dryer as well.',
        price: 154
      },
      {
        ownerId: 3,
        address: '59 Queen Dr',
        city: 'Des Moines',
        state: 'Iowa',
        country: 'United States of America',
        lat: 70,
        lng: -180,
        name: "Heaven's Gate",
        description: 'Extremely luxurious cabin with fooseball table.',
        price: 209
      },
      {
        ownerId: 3,
        address: '78 Camden Ln',
        city: 'Whippany',
        state: 'New Jersey',
        country: 'United States of America',
        lat: 70,
        lng: -180,
        name: 'Rock Solid',
        description: 'A lot of night-life around, with a family-friendly bar next door',
        price: 199
      },
      {
        ownerId: 3,
        address: '15 Somerset Ln',
        city: 'Princeton',
        state: 'New Jersey',
        country: 'United States of America',
        lat: 70,
        lng: -180,
        name: "The Lumberjack",
        description: 'Spacious apartment, with a bunch of amenities in the lobby',
        price: 156
      },
      {
        ownerId: 2,
        address: '13 Mother Ln',
        city: 'Jason',
        state: 'Iowa',
        country: 'United States of America',
        lat: 70,
        lng: -180,
        name: "Crystal Lake",
        description: '3 bedrooms and bath, and a fun haunted hay ride closeby',
        price: 99
      },
      {
        ownerId: 2,
        address: '13 Elm Street',
        city: 'Freddy',
        state: 'California',
        country: 'United States of America',
        lat: 70,
        lng: -180,
        name: "Nightmare",
        description: 'A lot of ghosts rumored in this town. Great spot for ghostbusters',
        price: 104
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
