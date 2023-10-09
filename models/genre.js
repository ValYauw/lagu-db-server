'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Genre extends Model {
    static associate(models) {
      Genre.hasMany(Genre, {
        as: 'subGenres',
        foreignKey: 'parentId',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      });
      Genre.belongsToMany(models.Song, { 
        through: models.SongGenre,
        as: 'song',
        foreignKey: 'GenreId',
        otherKey: 'SongId'
      });
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