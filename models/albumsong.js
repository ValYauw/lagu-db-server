'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AlbumSong extends Model {
    static associate(models) {}
  }
  AlbumSong.init({
    AlbumId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Albums',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      allowNull: false
    },
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
    discNumber: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    trackNumber: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'AlbumSong',
  });
  return AlbumSong;
};