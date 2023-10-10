'use strict';

const fs = require('fs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const rawSeedData = JSON.parse(fs.readFileSync('./data/artists.json'));
    const seedData = rawSeedData.map(el => {
      let { name, aliases, imageURL, description } = el;
      let createdAt = new Date();
      let updatedAt = new Date();
      return { name, aliases, imageURL, description, createdAt, updatedAt }
    });
    await queryInterface.bulkInsert('Artists', seedData, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Artists', null, {
      restartIdentity: true,
      cascade: true,
      truncate: true
    });
  }
};
