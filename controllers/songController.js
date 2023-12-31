const { 
  User,
  Genre, Song, Artist,
  SongGenre, SongArtist,
  PlayLink, ArtistLink, TimedLyrics, sequelize
} = require("../models");
const updateSubResources = require('../helpers/updateSubResources');
const {Op} = require('sequelize');
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
        order: [
          ['createdAt', 'DESC'],
          ['name', 'ASC'],
          ['id', 'ASC']
        ],
        // order: sequelize.literal('"Song"."createdAt" DESC'),
        attributes: {
          exclude: ['updatedAt']
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
            as: 'basedOn',
            attributes: {
              exclude: ['parentId', 'createdAt', 'updatedAt']
            }
          },
          {
            model: Song,
            as: 'derivatives',
            attributes: {
              exclude: ['parentId', 'createdAt', 'updatedAt']
            }
          },
          {
            model: Genre,
            as: 'genres',
            attributes: ['id', 'name'],
            through: { attributes: [] }
          },
          {
            model: Artist,
            as: 'artists',
            attributes: ['id', 'name', 'aliases'],
            through: { attributes: ['role'] }
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
      if (song.artists) {
        song.artists = song.artists.map(el => {
          const { id, name, aliases } = el;
          const role = el.SongArtist.role;
          return { id, name, aliases, role };
        })
      }
      if (song.timedLyrics) {
        song.timedLyrics = parser.fromVtt(song.timedLyrics.timedLyrics, 'ms');
      }

      res.status(200).json(song);
    } catch (err) {
      next(err)
    }
  }

  static async addSong(req, res, next) {
    const t = await sequelize.transaction();
    try {
      let { name, aliases, releaseDate, songType, parentId, artists, links } = req.body;

      // Main entity
      if (!aliases?.length) aliases = null;
      if (!releaseDate) releaseDate = null;
      if (!songType) songType = 'Original';
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
        await SongArtist.bulkCreate(addArtists, { 
          validate: true,
          transaction: t 
        });
      }

      // PlayLink Nested Resource
      if (links && links?.length) {
        const addPlayLinks = links.map(playLink => {
          const { songURL, isInactive } = playLink;
          return { songURL, isInactive, SongId: song.id }
        });
        await PlayLink.bulkCreate(addPlayLinks, { 
          validate: true,
          transaction: t 
        });
      }
      await t.commit();

      res.status(201).json({
        message: 'Successfully created song'
      });
      
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

      let { name, aliases, releaseDate, songType, parentId, artists, links } = req.body;
      name = name || '';
      if (!aliases?.length) aliases = null;
      if (!parentId) parentId = null;
      artists = artists || [];
      links = links || [];

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
        resources: artists.map(el => ({
          ArtistId: el.id,
          role: el.role 
        })), 
        transaction: t
      });

      // Nested resource: Playlinks
      await updateSubResources({
        model: PlayLink,
        foreignKey: 'SongId', 
        mainResourceId: song.id, 
        resources: links, 
        transaction: t
      });

      await t.commit();
      res.status(200).json({
        message: 'Successfully edited song'
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
        message: "Successfully deleted song"
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
      if (!genres.every(el => !!el.id)) throw { name: 'BadCredentials', message: 'Song genres must not be null' }

      const song = await Song.findByPk(+id, { attributes: ['id'] });
      if (!song) throw { name: 'NotFoundError' };

      await SongGenre.destroy({
        where: {
          GenreId: { [Op.notIn]: genres.map(el => el.id) },
          SongId: song.id
        },
        transaction: t
      });
      await SongGenre.bulkCreate(
        genres.map(el => ({
          GenreId: el.id,
          SongId: song.id
        })), {
          ignoreDuplicate: true,
          transaction: t
        }
      );
      await t.commit();
      res.status(200).json({
        message: 'Successfully edited song genres'
      });
    } catch (err) {
      await t.rollback();
      next(err);
    }
  }
  static async addTimedLyrics(req, res, next) {
    try {
      const { id } = req.params;
      if (!id || isNaN(id)) throw { name: 'NotFoundError' };
      const song = await Song.findByPk(+id);
      if (!song) throw { name: 'NotFoundError' };
      let { srt } = req.body;
      srt = srt?.trim() || '';
      if (!srt) throw { name: 'BadCredentials', message: 'SubRip Text contents required.' };
      const parsed = parser.fromVtt(srt, 'ms');
      if (!parsed?.length) throw { name: 'BadCredentials', message: 'Invalid SubRip Text contents.' };
      await TimedLyrics.create({
        SongId: +id,
        timedLyrics: srt
      });
      res.status(201).json({
        message: 'Successfully added lyrics'
      });
    } catch(err) {
      next(err);
    }
  }
  static async updateTimedLyrics(req, res, next) {
    try {
      const { id, lyricsId } = req.params;
      if (!id || isNaN(id)) throw { name: 'NotFoundError' };
      if (!lyricsId || isNaN(lyricsId)) throw { name: 'NotFoundError' };
      const timedLyrics = await TimedLyrics.findOne({
        attributes: ['id', 'SongId'],
        where: { id: +lyricsId }
      });
      if (!timedLyrics) throw { name: 'NotFoundError' };
      if (timedLyrics.SongId !== +id) throw { name: 'Forbidden' };
      let { srt } = req.body;
      srt = srt?.trim() || '';
      if (!srt) throw { name: 'BadCredentials', message: 'SubRip Text contents required.' };
      const parsed = parser.fromVtt(srt, 'ms');
      if (!parsed?.length) throw { name: 'BadCredentials', message: 'Invalid SubRip Text contents.' };
      await TimedLyrics.update({
        timedLyrics: srt
      }, {
        where: { id: timedLyrics.id }
      });
      res.status(200).json({
        message: 'Successfully edited lyrics'
      });
    } catch(err) {
      next(err);
    }
  }
  static async deleteTimedLyrics(req, res, next) {
    try {
      const { id, lyricsId } = req.params;
      if (!id || isNaN(id)) throw { name: 'NotFoundError' };
      if (!lyricsId || isNaN(lyricsId)) throw { name: 'NotFoundError' };
      const timedLyrics = await TimedLyrics.findOne({
        attributes: ['id', 'SongId'],
        where: { id: +lyricsId }
      });
      if (!timedLyrics) throw { name: 'NotFoundError' };
      if (timedLyrics.SongId !== +id) throw { name: 'Forbidden' };
      await TimedLyrics.destroy({
        where: { id: timedLyrics.id }
      });
      res.status(200).json({
        message: 'Successfully deleted lyrics'
      })
    } catch(err) {
      next(err);
    }
  }
}

module.exports = SongController;
