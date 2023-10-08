const { 
  User,
  Genre, Song, Artist, Album,
  SongGenre, SongArtist, AlbumSong,
  PlayLink, ArtistLink, sequelize
} = require("../models");

class AlbumController {

  static async getAlbums(req, res, next) {
    try {

      let { limit, offset } = req.query;
      offset = +offset || 0;
      limit = limit || 20;
      if (isNaN(limit) || isNaN(offset)) throw {name: 'BadCredentials'};
      if (limit > 100) limit = 100;

      let [[{count}], queriedAlbums] = await Promise.all([
        sequelize.query(`
          SELECT COUNT(DISTINCT("Album.id"))::INTEGER AS "count"
          FROM "ConsolidatedArtistAlbumSongs"
          `, 
          {
            type: sequelize.QueryTypes.SELECT
            // logging: () => {console.log('Querying albums');}
          }),
        sequelize.query(`
          SELECT DISTINCT
            "Album.id" AS "id", 
            "Album.name" AS "name", 
            "Album.aliases" AS "aliases", 
            "Album.imageURL" AS "imageURL", 
            "Album.releaseDate" AS "releaseDate", 
            "Album.description" AS "description",
            "Artist.id" AS "ArtistId", 
            "Artist.name" AS "ArtistName", 
            "Artist.aliases" AS "ArtistAliases"
          FROM "ConsolidatedArtistAlbumSongs"
          ORDER BY "name" ASC
          LIMIT $$1 OFFSET $$2;
          `, 
          {
            bind: [limit, offset],
            type: sequelize.QueryTypes.SELECT
            // logging: () => {console.log('Querying albums');}
          })
      ]);

      const albums = [];
      let lastAlbum;
      for (let queriedAlbum of queriedAlbums) {
        let { id, ArtistId, ArtistName, ArtistAliases } = queriedAlbum;
        if (!lastAlbum || lastAlbum.id !== id) {
          let { name, aliases, imageURL, releaseDate, description } = queriedAlbum;
          lastAlbum = {
            id, name, aliases, 
            imageURL, releaseDate, description,
            artists: []
          };
          albums.push(lastAlbum);
        }
        lastAlbum.artists.push({
          id: ArtistId,
          name: ArtistName,
          aliases: ArtistAliases
        })
      }

      res.status(200).json({
        count,
        offset,
        data: albums
      });
    } catch (err) {
      next(err)
    }
  }

  static async getAlbumById(req, res, next) {
    try {
      const {id} = req.params;
      if (isNaN(id)) throw {name: 'NotFoundError'};
      const album = await Album.findOne({
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
        where: {id: +id},
        include: {
          model: Song,
          as: 'trackList',
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          },
          include: {
            model: Artist,
            as: 'artists',
            attributes: ['name', 'aliases'],
            through: {
              attributes: ['role']
            }
          },
          through: {
            attributes: ['discNumber', 'trackNumber']
          }
        },
        order: [
          ['trackList', AlbumSong, 'discNumber', 'ASC'],
          ['trackList', AlbumSong, 'trackNumber', 'ASC']
        ]
      });
      if (!album) throw { name: 'NotFoundError' };

      for (let song of album.trackList) {
        song.dataValues.discNumber = song.AlbumSong.discNumber;
        song.dataValues.trackNumber = song.AlbumSong.trackNumber;
        delete song.dataValues.AlbumSong;
        for (let artist of song.artists) {
          artist.dataValues.role = artist.SongArtist.role;
          delete artist.dataValues.SongArtist;
        }
      };

      res.status(200).json(album);
    } catch (err) {
      next(err)
    }
  }

  // static async addAlbum(req, res, next) {

  // }
  // static async editAlbum(req, res, next) {
    
  // }
  // static async deleteAlbum(req, res, next) {

  // }

  // static async addTrack(req, res, next) {

  // }
  // static async editTrack(req, res, next) {

  // }
  // static async deleteTrack(req, res, next) {

  // }

}

module.exports = AlbumController;
