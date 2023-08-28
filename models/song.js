'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Song extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Song.hasMany(Song, {
        foreignKey: 'parentId',
        as: 'Children',
        onDelete: 'SET NULL'
      });
      Song.hasMany(models.PlayLink, {
        onDelete: 'CASCADE'
      });
      Song.belongsToMany(models.Artist, 
        { through: models.SongArtist }
      );
      Song.belongsToMany(models.Album, 
        { through: models.AlbumSong }
      );
      Song.belongsToMany(models.Genre, 
        { through: models.SongGenre }
      );
    }
  }
  Song.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {msg: 'Song name is required'},
        notNull: {msg: 'Song name is required'}
      }
    },
    aliases: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true
    },
    releaseDate: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isDate: {msg: 'Song release date is not valid'}
      }
    },
    songType: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ['Original', 'Cover', 'Remix', 'Remaster'],
      defaultValue: 'Original',
      validate: {
        notEmpty: {msg: 'Song type is required'},
        notNull: {msg: 'Song type is required'},
        isIn: {
          msg: 'Song type is invalid',
          args: [['Original', 'Cover', 'Remix', 'Remaster']]
        }
      }
    },
    parentId: {
      type: DataTypes.STRING,
      references: {
        model: 'Songs',
        key: 'id'
      },
      allowNull: true,
      validate: {
        notSelfReference(value) {
          if (parseInt(value) === parseInt(this.id)) {
            throw new Error('Song cannot have itself as a parent');
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Song',
  });
  return Song;
};