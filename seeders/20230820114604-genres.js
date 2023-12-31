'use strict';

const fs = require('fs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const rawSeedData = JSON.parse(fs.readFileSync('./data/genres.json'));
    const seedData = rawSeedData.map(el => {
      let { name, parentId } = el;
      let createdAt = new Date();
      let updatedAt = new Date();
      return { name, parentId, createdAt, updatedAt }
    });
    await queryInterface.bulkInsert('Genres', seedData, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Genres', null, {
      restartIdentity: true,
      cascade: true,
      truncate: true
    });
  }
};
