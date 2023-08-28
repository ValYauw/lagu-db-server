const { 
  User,
  Genre, Song, Artist, Album,
  SongGenre, SongArtist, AlbumSong,
  PlayLink, ArtistLink, sequelize
} = require("../models");
const {Op} = require('sequelize');

class SearchController {

  static async query(tableName, searchTerm, limit, offset) {

    let [{count}] = await sequelize.query(`
    SELECT COUNT(DISTINCT("id"))::INTEGER FROM
    (SELECT "id", "name", unnest("aliases") AS "alias" FROM "${tableName}") AS "flat"
    WHERE "name" ILIKE $$1 OR "alias" ILIKE $$1
    LIMIT $$2 OFFSET $$3;
    `, {
      bind: [ `%${searchTerm}%`, limit, offset ],
      type: sequelize.QueryTypes.SELECT
    });

    let elements = await sequelize.query(`
    SELECT DISTINCT "id", "name", "flat"."alias" FROM 
    (SELECT "id", "name", unnest("aliases") AS "alias" FROM "${tableName}") AS "flat"
    WHERE "name" ILIKE $$1 OR "alias" ILIKE $$1
    LIMIT $$2 OFFSET $$3;
    `, {
      bind: [ `%${searchTerm}%`, limit, offset ],
      type: sequelize.QueryTypes.SELECT
    });

    return [count, elements];
  } 

  static async processLimitAndOffset(req, res, next) {
    let { limit, offset } = req.query;
    offset = +offset || 0;
    limit = limit || 20;
    if (isNaN(limit) || isNaN(offset)) throw {name: 'BadCredentials'};
    if (limit > 100) limit = 100;

    req.limit = limit;
    req.offset = offset;
    next();
  }

  static async searchSongs(req, res, next) {
    try {
      let { limit, offset } = req;
      let { title } = req.query;
      const [count, songs] = await SearchController.query("Songs", title, limit, offset);
      res.status(200).json({ count, offset, data: songs });
    } catch(err) {
      next(err);
    }
  }

  static async searchAlbums(req, res, next) {
    try {
      let { limit, offset } = req;
      let { title } = req.query;
      const [count, albums] = await SearchController.query("Albums", title, limit, offset);
      res.status(200).json({ count, offset, data: albums });
    } catch(err) {
      next(err);
    }
  }

  static async searchArtists(req, res, next) {
    try {
      let { limit, offset } = req;
      let { title } = req.query;
      const [count, artists] = await SearchController.query("Artists", title, limit, offset);
      res.status(200).json({ count, offset, data: artists });
    } catch(err) {
      next(err);
    }
  }

}

module.exports = SearchController;
