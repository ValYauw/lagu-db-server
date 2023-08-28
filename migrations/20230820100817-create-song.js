'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Songs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      aliases: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true
      },
      releaseDate: {
        type: Sequelize.DATE
      },
      songType: {
        type: Sequelize.ENUM,
        values: ['Original', 'Cover', 'Remix', 'Remaster'],
        allowNull: false,
        defaultValue: 'Original'
      },
      parentId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        onDelete: 'SET NULL',
        references: {
          model: 'Songs', 
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Songs');
  }
};