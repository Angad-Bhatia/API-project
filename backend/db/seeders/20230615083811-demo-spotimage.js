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
        url: 'https://img.staticmb.com/mbcontent/images/uploads/2022/12/Most-Beautiful-House-in-the-World.jpg',
        preview: true
      },
      {
        spotId: 1,
        url: 'https://mediavault.point2.com/p2h/listing/643d/ffab/b39c/84d359c248d9d0b9f2ea/nwm_large.jpg',
        preview: false
      },
      {
        spotId: 1,
        url: 'https://mediacloud.theweek.com/image/upload/f_auto,t_content-image-mobile@1/v1679070874/TWS1122.Props.DesMoinessExt.jpg',
        preview: false
      },
      {
        spotId: 1,
        url: 'https://www.onlyinyourstate.com/wp-content/uploads/2016/11/brucemore.jpg',
        preview: false
      },
      {
        spotId: 1,
        url: 'https://www.onlyinyourstate.com/wp-content/uploads/2016/11/brucemore.jpg',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://cdn.houseplansservices.com/content/oanrn2hpo2onko9gr94416qock/w991x660.jpg',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://housekaboodle.com/wp-content/uploads/1897-Queen-Anne-in-Osceola-IA-on-the-market.jpg',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://cdn.captivatinghouses.com/wp-content/uploads/2022/11/9EEFDEAA-9291-4F39-A087-AB61EE0305F5.jpeg',
        preview: true
      },
      {
        spotId: 5,
        url: 'https://www.luxuryhomemagazine.com/lhm_listings/73132/Strawberry-Park-001-(002)_-NEW1.jpg',
        preview: true
      },
      {
        spotId: 6,
        url: 'https://www.homebuilderdigest.com/wp-content/uploads/2019/06/Cus-Home-DM-IA-1.jpg',
        preview: true
      },
      {
        spotId: 7,
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Close_house_iowa_city.jpg/1200px-Close_house_iowa_city.jpg',
        preview: true
      },
      {
        spotId: 8,
        url: 'https://www.newcastlehomebuilders.com/img/square-600/price.jpg',
        preview: true
      },
      {
        spotId: 9,
        url: 'https://www.oldhousedreams.com/wp-content/uploads/2023/06/01-516-Broadway-St.jpg',
        preview: true
      },
      {
        spotId: 10,
        url: 'https://solconsults.com/media/projects/iowa-city-nest/Iowa-City-PH-main-ext1.jpg',
        preview: true
      },
      {
        spotId: 11,
        url: 'https://www.precisioncraft.com/_images/regions/ia-thumb2.jpg',
        preview: true
      },
      {
        spotId: 12,
        url: 'https://www.onlyinyourstate.com/wp-content/uploads/2015/09/34.jpg',
        preview: true
      },
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
