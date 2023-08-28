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
    const rawSeedData = JSON.parse(fs.readFileSync('./data/song-genres.json'));
    const seedData = rawSeedData.map(el => {
      let { SongId, GenreId } = el;
      let createdAt = new Date();
      let updatedAt = new Date();
      return { SongId, GenreId, createdAt, updatedAt }
    });
    await queryInterface.bulkInsert('SongGenres', seedData, {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('SongGenres', null, {});
  }
};
