'use strict';

const fs = require('fs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const rawSeedData = JSON.parse(fs.readFileSync('./data/timed-lyrics.json'));
    const seedData = rawSeedData.map(el => {
      let { SongId, timedLyrics } = el;
      let createdAt = new Date();
      let updatedAt = new Date();
      return { SongId, timedLyrics, createdAt, updatedAt }
    });
    await queryInterface.bulkInsert('TimedLyrics', seedData, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('TimedLyrics', null, {
      restartIdentity: true,
      cascade: true,
      truncate: true
    });
  }
};
