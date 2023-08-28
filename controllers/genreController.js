const { 
  User,
  Genre, Song, Artist, Album,
  SongGenre, SongArtist, AlbumSong,
  PlayLink, ArtistLink, sequelize
} = require("../models");
const {Op} = require('sequelize');

class GenreController {

  static async getAllGenres(req, res, next) {
    try {
      const genres = await Genre.findAll({
        order: [
          ['name', 'ASC'],
          ['Sub-genres', 'name', 'ASC']
        ],
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'parentId']
        },
        include: {
          model: Genre,
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'parentId']
          },
          as: 'Sub-genres'
        },
        where: {parentId: null}
      });
      res.status(200).json(genres);
    } catch (err) {
      next(err)
    }
  }

  static async getSongsByGenre(req, res, next) {
    try {

      const { id } = req.params;
      if (isNaN(id)) throw {name: 'NotFoundError'};

      let { limit, offset } = req.query;
      offset = +offset || 0;
      limit = limit || process.env.NUM_RECORDS_PER_QUERY;
      if (isNaN(limit) || isNaN(offset)) throw {name: 'BadCredentials'};
      if (limit > 100) limit = 100;

      const genre = await Genre.findOne({where: {id: +id}});
      if (!genre) throw { name: 'NotFoundError' };
      const { count, rows: songs } = await Song.findAndCountAll({
        order: [['name', 'ASC']],
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'parentId']
        },
        include: [
          {
            model: Artist,
            attributes: ['id', 'name'],
            through: {attributes: []}
          },
          {
            model: PlayLink,
            attributes: ['id', 'songURL', 'isInactive']
          },
          {
            model: Genre,
            attributes: [],
            through: {attributes: []},
            where: { id: +id }
          }
        ],
        distinct: true
      });
      res.status(200).json({
        count, offset, data: songs
      });
    } catch (err) {
      next(err)
    }
  }

  static async getGenreAndItsChildren(req, res, next) {
    try {
      const { id } = req.params;
      if (isNaN(id)) throw {name: 'NotFoundError'};
      const genre = await Genre.findOne({
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'parentId']
        },
        order: [['Sub-genres', 'name', 'ASC']],
        where: {id: +id},
        include: {
          model: Genre,
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'parentId']
          },
          as: 'Sub-genres'
        }
      });
      if (!genre) throw {name: 'NotFoundError'};
      res.status(200).json(genre);
    } catch (err) {
      next(err);
    }
  }

  // static async addGenre(req, res, next) {

  // }
  // static async editGenre(req, res, next) {

  // }
  // static async deleteGenre(req, res, next) {

  // }

}

module.exports = GenreController;
