'use strict';

const fs = require('fs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const rawSeedData = JSON.parse(fs.readFileSync('./data/artist-links.json'));
    const seedData = rawSeedData.map(el => {
      let { webURL, description, ArtistId } = el;
      let createdAt = new Date();
      let updatedAt = new Date();
      return { webURL, description, ArtistId, createdAt, updatedAt }
    });
    await queryInterface.bulkInsert('ArtistLinks', seedData, {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('ArtistLinks', null, {});
  }
};
