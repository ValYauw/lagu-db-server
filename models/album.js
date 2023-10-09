'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Album extends Model {
    static associate(models) {
      Album.belongsToMany(models.Song, { 
        through: models.AlbumSong,
        as: 'trackList',
        foreignKey: 'AlbumId',
        otherKey: 'SongId'
      });
    }
  }
  Album.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {msg: 'Album name is required'},
        notNull: {msg: 'Album name is required'},
      }
    },
    aliases: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true
    },
    imageURL: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: {msg: 'Image URL is not valid'}
      }
    },
    releaseDate: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: {msg: 'Album release date is not valid'},
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Album',
  });
  return Album;
};