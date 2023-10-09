'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Song extends Model {
    static associate(models) {
      Song.hasMany(Song, {
        as: 'derivatives',
        foreignKey: 'parentId',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      });
      Song.hasMany(models.PlayLink, {
        as: 'links',
        foreignKey: 'PlayLinkId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      Song.hasOne(models.TimedLyrics, {
        as: 'timedLyrics',
        foreignKey: 'SongId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      Song.belongsToMany(models.Artist, { 
        as: 'artists',
        through: models.SongArtist,
        foreignKey: 'SongId',
        otherKey: 'ArtistId'
      });
      // Song.belongsToMany(models.Album, { 
      //   as: 'albums',
      //   through: models.AlbumSong,
      //   foreignKey: 'SongId',
      //   otherKey: 'AlbumId'
      // });
      Song.belongsToMany(models.Genre, { 
        as: 'genres',
        through: models.SongGenre,
        foreignKey: 'SongId',
        otherKey: 'GenreId'
      });
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