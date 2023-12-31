'use strict';

const fs = require('fs');
const { encrypt } = require('../helpers/encrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const rawSeedData = JSON.parse(fs.readFileSync('./data/users.json'));
    const seedData = rawSeedData.map(el => {
      let { username, email, password, role } = el;
      password = encrypt(password);
      let createdAt = new Date();
      let updatedAt = new Date();
      return { username, email, password, role, createdAt, updatedAt }
    });
    await queryInterface.bulkInsert('Users', seedData, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {
      restartIdentity: true,
      cascade: true,
      truncate: true
    });
  }
};
