'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PlayLink extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PlayLink.belongsTo(models.Song, {
        onDelete: 'CASCADE'
      });
    }
  }
  PlayLink.init({
    songURL: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {msg: 'Song URL is required'},
        notEmpty: {msg: 'Song URL is required'},
        isUrl: {msg: 'Song URL is not valid'}
      }
    },
    isInactive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    SongId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Songs',
        key: 'id'
      },
      validate: {
        notNull: {msg: 'Song ID is required'},
        notEmpty: {msg: 'Song ID is required'},
      }
    }
  }, {
    sequelize,
    modelName: 'PlayLink',
  });
  return PlayLink;
};