'use strict';

const fs = require('fs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const rawSeedData = JSON.parse(fs.readFileSync('./data/song-artists.json'));
    const seedData = rawSeedData.map(el => {
      let { SongId, ArtistId, role } = el;
      let createdAt = new Date();
      let updatedAt = new Date();
      return { SongId, ArtistId, role, createdAt, updatedAt }
    });
    await queryInterface.bulkInsert('SongArtists', seedData, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('SongArtists', null, {
      restartIdentity: true,
      cascade: true,
      truncate: true
    });
  }
};
