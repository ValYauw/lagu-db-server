'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Album extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Album.belongsToMany(models.Song, 
        { through: models.AlbumSong }
      );
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