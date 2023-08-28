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
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Songs', null, {});
  }
};
