'use strict';

const fs = require('fs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const rawSeedData = JSON.parse(fs.readFileSync('./data/play-links.json'));
    const seedData = rawSeedData.map(el => {
      let { songURL, SongId } = el;
      let createdAt = new Date();
      let updatedAt = new Date();
      return { songURL, SongId, createdAt, updatedAt }
    });
    await queryInterface.bulkInsert('PlayLinks', seedData, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('PlayLinks', null, {
      restartIdentity: true,
      cascade: true,
      truncate: true
    });
  }
};
