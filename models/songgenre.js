'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SongGenre extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  SongGenre.init({
    SongId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Songs',
        key: 'id'
      },
      allowNull: false
    },
    GenreId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Genres',
        key: 'id'
      },
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'SongGenre',
  });
  return SongGenre;
};