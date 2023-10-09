const { 
  User,
  Genre, Song, Artist,
  SongGenre, SongArtist,
  PlayLink, ArtistLink, TimedLyrics, sequelize
} = require("../models");
const updateSubResources = require('../helpers/updateSubResources');
const parser = require('subtitles-parser-vtt');

class SongController {

  static async getSongs(req, res, next) {
    try {

      let { limit, offset } = req.query;
      offset = +offset || 0;
      limit = limit || 20;
      if (isNaN(limit) || isNaN(offset)) throw {name: 'BadCredentials'};
      if (limit > 100) limit = 100;

      const songs = await Song.findAndCountAll({
        order: [['name', 'ASC']],
        // order: sequelize.literal('"Song"."createdAt" DESC'),
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
        include: [
          {
            model: Artist,
            as: 'artists',
            attributes: ['id', 'name', 'aliases'],
            through: {attributes: []}
          },
          {
            model: PlayLink,
            as: 'links',
            attributes: ['id', 'songURL', 'isInactive']
          }
        ],
        distinct: true,
        limit, offset
      });
      res.status(200).json({
        count: songs.count,
        offset,
        data: songs.rows
      });
    } catch (err) {
      next(err)
    }
  }

  static async getSongById(req, res, next) {
    try {
      const {id} = req.params;
      if (isNaN(id)) throw {name: 'NotFoundError'};
      let song = await Song.findOne({
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
        where: {id: +id},
        include: [
          {
            model: Song,
            as: 'derivatives',
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            }
          },
          {
            model: Genre,
            as: 'genres',
            attributes: ['id', 'name'],
            through: {attributes: []}
          },
          {
            model: Artist,
            as: 'artists',
            attributes: ['id', 'name', 'aliases'],
            through: {attributes: []}
          },
          // {
          //   model: Album,
          //   as: 'albums',
          //   attributes: ['id', 'name', 'aliases', 'releaseDate'],
          //   through: {attributes: []}
          // },
          {
            model: PlayLink,
            as: 'links',
            attributes: ['id', 'songURL', 'isInactive']
          },
          {
            model: TimedLyrics,
            as: 'timedLyrics',
            attributes: ['id', 'timedLyrics']
          }
        ]
      });
      if (!song) throw {name: 'NotFoundError'};

      song = JSON.parse(JSON.stringify(song));
      // song.TimedLyrics = song.TimedLyrics.map(el => {
      //   const { id, timedLyrics } = el;
      //   const arr = parser.fromVtt(timedLyrics, 'ms');
      //   return {id, parsedSrt: arr};
      // });
      if (song.TimedLyric) {
        song.TimedLyric = {
          id: song.TimedLyric.id,
          parsedSrt: parser.fromVtt(song.TimedLyric.timedLyrics, 'ms')
        }
      }

      res.status(200).json(song);
    } catch (err) {
      next(err)
    }
  }

  static async addSong(req, res, next) {
    const t = await sequelize.transaction();
    try {
      let { name, aliases, releaseDate, songType, parentId, artists, playLinks } = req.body;

      // Main entity
      if (!aliases?.length) aliases = null;
      if (!parentId) parentId = null;
      let song = await Song.create(
        { name, aliases, releaseDate, songType, parentId }, 
        { transaction: t }
      );

      // SongArtist Nested Resource
      if (artists && artists?.length) {
        const addArtists = artists.map(artist => {
          const { id: ArtistId, role } = artist;
          return { SongId: song.id, ArtistId, role };
        });
        await SongArtist.bulkCreate(addArtists, { transaction: t });
      }

      // PlayLink Nested Resource
      if (playLinks && playLinks?.length) {
        const addPlayLinks = playLinks.map(playLink => {
          const { songURL, isInactive } = playLink;
          return { songURL, isInactive, SongId: song.id }
        });
        await PlayLink.bulkCreate(addPlayLinks, { transaction: t });
      }
      await t.commit();

      // Get created Song resource
      song = await Song.findOne({
        where: {id: song.id}, 
        include: [
          { model: Artist, through: { attributes: [] } }, 
          { model: PlayLink }
        ]
      });
      res.status(201).json(song);
      
    } catch(err) {
      await t.rollback();
      next(err);
    }
  }
  static async editSong(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      if (!id || isNaN(id)) throw { name: 'NotFoundError' };
      let song = await Song.findByPk(id, {attributes: ['id']});
      if (!song) throw { name: 'NotFoundError' };

      let { name, aliases, releaseDate, songType, parentId, artists, playLinks } = req.body;
      if (!aliases?.length) aliases = null;
      if (!parentId) parentId = null;
      artists = artists || [];
      playLinks = playLinks || [];

      // Main Entity
      await Song.update(
        { name, aliases, releaseDate, songType, parentId }, 
        {
          where: {id: +id},
          transaction: t
        }
      );

      // Nested resource: Artists
      await updateSubResources({
        model: SongArtist,
        foreignKey: 'SongId', 
        mainResourceId: song.id, 
        resources: artists, 
        transaction: t
      });

      // Nested resource: Playlinks
      await updateSubResources({
        model: PlayLink,
        foreignKey: 'SongId', 
        mainResourceId: song.id, 
        resources: playLinks, 
        transaction: t
      });

      await t.commit();
      res.status(200).json({
        message: 'Edited song data'
      });

    } catch(err) {
      await t.rollback();
      next(err);
    }
  }
  static async deleteSong(req, res, next) {
    try {
      const { id } = req.params;
      if (isNaN(id)) throw {name: "NotFoundError"};
      const song = await Song.findOne({where: {id: +id}});
      if (!song) throw {name: "NotFoundError"};
      await Song.destroy({
        where: {id: +id}
      });
      res.status(200).json({
        message: "Successfully deleted"
      });
    } catch(err) {
      next(err);
    }
  }
  static async createOrUpdateSongGenres(req, res, next) {
    const t = await sequelize.transaction();
    try {

      const { id } = req.params;
      if (!id || isNaN(id)) throw { name: 'NotFoundError' }
      const { genres } = req.body;
      if (!genres) throw { name: 'BadCredentials', message: 'Song genres must not be null' }

      await updateSubResources({
        model: SongGenre,
        foreignKey: 'SongId', 
        mainResourceId: +id, 
        resources: genres, 
        transaction: t
      });

      await t.commit();
      res.status(200).json({
        message: 'Edited song data'
      });
    } catch (err) {
      await t.rollback();
      next(err);
    }
  }
}

module.exports = SongController;
