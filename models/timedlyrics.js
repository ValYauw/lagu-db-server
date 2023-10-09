'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TimedLyrics extends Model {
    static associate(models) {
      TimedLyrics.belongsTo(models.Song, {
        as: 'song',
        foreignKey: 'SongId'
      });
    }
  }
  TimedLyrics.init({
    SongId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Songs',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    timedLyrics: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {msg: 'Lyrics is required'},
        notEmpty: {msg: 'Lyrics is required'}
      }
    }
  }, {
    sequelize,
    modelName: 'TimedLyrics',
  });
  return TimedLyrics;
};