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
    const rawSeedData = JSON.parse(fs.readFileSync('./data/album-song.json'));
    const seedData = rawSeedData.map(el => {
      let { AlbumId, SongId, discNumber, trackNumber } = el;
      let createdAt = new Date();
      let updatedAt = new Date();
      return { AlbumId, SongId, discNumber, trackNumber, createdAt, updatedAt }
    });
    await queryInterface.bulkInsert('AlbumSongs', seedData, {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('AlbumSongs', null, {});
  }
};
