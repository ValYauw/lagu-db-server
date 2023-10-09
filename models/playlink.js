'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PlayLink extends Model {
    static associate(models) {
      PlayLink.belongsTo(models.Song, {
        as: 'song',
        foreignKey: 'SongId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }
  PlayLink.init({
    songURL: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {msg: 'Song URL is required'},
        notEmpty: {msg: 'Song URL is required'},
        isUrl: {msg: 'Song URL is not valid'}
      }
    },
    isInactive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    SongId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Songs',
        key: 'id'
      },
      validate: {
        notNull: {msg: 'Song ID is required'},
        notEmpty: {msg: 'Song ID is required'},
      }
    }
  }, {
    sequelize,
    modelName: 'PlayLink',
  });
  return PlayLink;
};