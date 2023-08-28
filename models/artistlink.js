'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ArtistLink extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ArtistLink.belongsTo(models.Artist, {
        onDelete: 'CASCADE'
      });
    }
  }
  ArtistLink.init({
    webURL: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {msg: 'Web URL is required'},
        notEmpty: {msg: 'Web URL is required'},
        isUrl: {msg: 'Web URL is not valid'}
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {msg: 'Description is required'},
        notEmpty: {msg: 'Description is required'}
      }
    },
    isInactive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    ArtistId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Artists',
        key: 'id'
      },
      validate: {
        notNull: {msg: 'Artist ID is required'},
        notEmpty: {msg: 'Artist ID is required'},
      }
    }
  }, {
    sequelize,
    modelName: 'ArtistLink',
  });
  return ArtistLink;
};