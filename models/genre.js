'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Genre extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Genre.hasMany(Genre, {
        foreignKey: 'parentId',
        as: 'Sub-genres',
        onDelete: 'SET NULL'
      });
      Genre.belongsToMany(models.Song, 
        { through: models.SongGenre }
      );
    }
  }
  Genre.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {msg: 'Genre name is required'},
        notNull: {msg: 'Genre name is required'}
      }
    },
    parentId: {
      type: DataTypes.STRING,
      references: {
        model: 'Genres',
        key: 'id'
      },
      allowNull: true,
      validate: {
        notSelfReference(value) {
          if (parseInt(value) === parseInt(this.id)) {
            throw new Error('Genre cannot have itself as a parent');
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Genre',
  });
  return Genre;
};