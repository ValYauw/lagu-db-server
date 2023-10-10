'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SongArtist extends Model {
    static associate(models) { }
  }
  SongArtist.init({
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
    ArtistId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Artists',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'SongArtist',
  });
  return SongArtist;
};