'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TimedLyrics extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TimedLyrics.belongsTo(models.Song);
    }
  }
  TimedLyrics.init({
    SongId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Songs',
        key: 'id'
      }
    },
    timedLyrics: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {msg: 'Lyrics is required'},
        notEmpty: {msg: 'Lyrics is required'}
      }
    }
  }, {
    sequelize,
    modelName: 'TimedLyrics',
  });
  return TimedLyrics;
};