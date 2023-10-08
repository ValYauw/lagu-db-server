'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Artist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Artist.hasMany(models.ArtistLink, {
        as: 'links',
        onDelete: 'CASCADE'
      });
      Artist.belongsToMany(models.Song, { 
        through: models.SongArtist,
        as: 'songs'
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