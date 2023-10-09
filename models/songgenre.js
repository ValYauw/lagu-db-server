'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SongGenre extends Model {
    static associate(models) { }
  }
  SongGenre.init({
    SongId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Songs',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      allowNull: false
    },
    GenreId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Genres',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'SongGenre',
  });
  return SongGenre;
};