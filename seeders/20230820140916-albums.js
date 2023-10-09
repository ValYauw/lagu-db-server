'use strict';

const fs = require('fs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const rawSeedData = JSON.parse(fs.readFileSync('./data/albums.json'));
    const seedData = rawSeedData.map(el => {
      let { name, aliases, imageURL, releaseDate, description } = el;
      let createdAt = new Date();
      let updatedAt = new Date();
      return { name, aliases, imageURL, releaseDate, description, createdAt, updatedAt }
    });
    await queryInterface.bulkInsert('Albums', seedData, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Albums', null, {
      restartIdentity: true,
      cascade: true,
      truncate: true
    });
  }
};
