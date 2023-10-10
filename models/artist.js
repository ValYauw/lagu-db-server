'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Artist extends Model {
    static associate(models) {
      Artist.hasMany(models.ArtistLink, {
        as: 'links',
        foreignKey: 'ArtistId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      Artist.belongsToMany(models.Song, { 
        through: models.SongArtist,
        as: 'songs',
        foreignKey: 'ArtistId',
        otherKey: 'SongId'
      });
    }
  }
  Artist.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {msg: 'Artist name is required'},
        notEmpty: {msg: 'Artist name is required'}
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Artist',
  });
  return Artist;
};