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
        userId: 2,
        review: 'I love this place, so, so much',
        stars: 5
      },
      {
        spotId: 2,
        userId: 2,
        review: "It stinks, but I've definitely seen a lot worse",
        stars: 2
      },
      {
        spotId: 3,
        userId: 2,
        review: 'Never am I going to stay in such a wretched place again',
        stars: 1
      },
      {
        spotId: 4,
        userId: 2,
        review: "It was fine, nothing all that special, really",
        stars: 3
      },
      {
        spotId: 5,
        userId: 2,
        review: "10/10 recommend. I will 100% be staying here again.",
        stars: 5
      },
      {
        spotId: 6,
        userId: 2,
        review: "Pretty good place, just not much to do in the area.",
        stars: 4
      },
      {
        spotId: 7,
        userId: 2,
        review: "Very meh. I'd book here if it's your last option",
        stars: 3
      },
      {
        spotId: 8,
        userId: 2,
        review: "One of the absolute worst experiences of my life",
        stars: 1
      },
      {
        spotId: 9,
        userId: 2,
        review: "I had a good time here, but the sleeping arrangements were uncomfortable",
        stars: 3
      },
      {
        spotId: 10,
        userId: 2,
        review: "Had an absolute blast, but the place could've been cleaner",
        stars: 4
      },
      {
        spotId: 11,
        userId: 3,
        review: "It was not as scary as I thought. Pretty overrated",
        stars: 1
      },
      {
        spotId: 12,
        userId: 3,
        review: "All-time amazing experience. This is truly a classic",
        stars: 5
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
