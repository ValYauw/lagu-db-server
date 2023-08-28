'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AlbumSong extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AlbumSong.init({
    AlbumId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Albums',
        key: 'id'
      },
      allowNull: false
    },
    SongId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Songs',
        key: 'id'
      },
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