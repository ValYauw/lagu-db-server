'use strict';

const fs = require('fs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const rawSeedData = JSON.parse(fs.readFileSync('./data/songs.json'));
    const seedData = rawSeedData.map(el => {
      let { name, aliases, releaseDate, songType } = el;
      let createdAt = new Date();
      let updatedAt = new Date();
      return { name, aliases, releaseDate, songType, createdAt, updatedAt }
    });
    await queryInterface.bulkInsert('Songs', seedData, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Songs', null, {
      restartIdentity: true,
      cascade: true,
      truncate: true
    });
  }
};
