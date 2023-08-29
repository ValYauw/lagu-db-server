const { 
  User,
  Genre, Song, Artist, Album,
  SongGenre, SongArtist, AlbumSong,
  PlayLink, ArtistLink, TimedLyrics, sequelize
} = require("../models");

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
          // {
          //   model: Genre,
          //   attributes: ['id', 'name'],
          //   through: {attributes: []}
          // },
          {
            model: Artist,
            attributes: ['id', 'name', 'aliases'],
            through: {attributes: []}
          },
          {
            model: PlayLink,
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
      const song = await Song.findOne({
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
        where: {id: +id},
        include: [
          {
            model: Song,
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            },
            as: 'Children'
          },
          {
            model: Genre,
            attributes: ['id', 'name'],
            through: {attributes: []}
          },
          {
            model: Artist,
            attributes: ['id', 'name', 'aliases'],
            through: {attributes: []}
          },
          {
            model: Album,
            attributes: ['id', 'name', 'aliases', 'releaseDate'],
            through: {attributes: []}
          },
          {
            model: PlayLink,
            attributes: ['id', 'songURL', 'isInactive']
          },
          {
            model: TimedLyrics,
            attributes: ['id', 'timedLyrics']
          }
        ]
      });
      if (!song) throw {name: 'NotFoundError'};
      res.status(200).json(song);
    } catch (err) {
      next(err)
    }
  }

  static async addSong(req, res, next) {
    try {
      let { name, aliases, releaseDate, songType, parentId, artists, playLinks } = req.body;
      if (!aliases?.length) aliases = null;
      if (!parentId) parentId = null;
      let song = await Song.create({name, aliases, releaseDate, songType, parentId});
      if (artists && artists?.length) {
        const addArtists = artists.map(artist => {
          const { id: ArtistId, role } = artist;
          return { SongId: song.id, ArtistId, role };
        });
        await SongArtist.bulkCreate(addArtists);
      }
      if (playLinks && playLinks?.length) {
        const addPlayLinks = playLinks.map(playLink => {
          const { songURL, isInactive } = playLink;
          return { songURL, isInactive, SongId: song.id }
        });
        await PlayLink.bulkCreate(addPlayLinks);
      }
      song = await Song.findOne({
        where: {id: song.id}, 
        include: [
          { model: Artist, through: { attributes: [] } }, 
          { model: PlayLink }
        ]
      });
      res.status(201).json(song);
    } catch(err) {
      next(err);
    }
  }
  static async editSong(req, res, next) {
    try {
      const { id } = req.params;
      let { name, aliases, releaseDate, songType, parentId } = req.body;
      if (!aliases?.length) aliases = null;
      let [numUpdated, song] = await Song.update(
        {name, aliases, releaseDate, songType, parentId}, 
        {where: {id: +id}}
      );
      if (numUpdated === 0) throw { name: 'NotFoundError' };
      res.status(200).json({
        message: 'Edited song data'
      });
    } catch(err) {
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

  static async addPlayLink(req, res, next) {
    try {
      const { id } = req.params;
      let { songURL, isInactive } = req.body;
      isInactive = !!isInactive;
      if (isNaN(id)) throw {name: "NotFoundError"};
      const artist = await Artist.findByPk(+id);
      if (!artist) throw {name: "NotFoundError"};
      await PlayLink.create({ songURL, isInactive, SongId: +id });
      res.status(201).json({
        message: "Successfully added play link to song"
      });
    } catch (err) {
      next(err);
    }
  }
  static async deletePlayLink(req, res, next) {
    try {
      const { id, playLinkId } = req.params;
      if (isNaN(id) || isNaN(playLinkId)) throw {name: "NotFoundError"};
      const playlink = await PlayLink.findOne({where: {id: +playLinkId}});
      if (!playlink || playlink.SongId !== +id) throw {name: "NotFoundError"};
      await PlayLink.destroy({where: {id: +playLinkId}});
      res.status(200).json({
        message: "Successfully removed play link from song"
      });
    } catch(err) {
      next(err);
    }
  }
  static async editPlayLinkStatus(req, res, next) {
    try {
      const { id, playLinkId } = req.params;
      const { isInactive } = req.body;
      if (isNaN(id) || isNaN(playLinkId)) throw {name: "NotFoundError"};
      const [numRecordsUpdated, playlinks] = await PlayLink.update(
        { isInactive },
        { where: {id: +playLinkId, SongId: +id}, returning: true }
      );
      if (numRecordsUpdated === 0) throw {name: 'NotFoundError'};
      res.status(200).json({
        message: "Successfully updated status"
      });
    } catch(err) {
      next(err);
    }
  }

  static async addSongGenre(req, res, next) {
    try {
      const { id, genreId } = req.params;
      if (isNaN(id) || isNaN(genreId)) throw {name: "NotFoundError"};
      const [song, genre] = await Promise.all([
        Song.findByPk(+id),
        Genre.findByPk(+genreId)
      ])
      if (!song || !genre) throw {name: "NotFoundError"};
      await SongGenre.create({SongId: +id, GenreId: +genreId});
      res.status(201).json({
        message: "Successfully added genre to song"
      });
    } catch (err) {
      next(err);
    }
  }
  static async deleteSongGenre(req, res, next) {
    try {
      const { id, genreId } = req.params;
      if (isNaN(id) || isNaN(genreId)) throw {name: "NotFoundError"};
      const songGenre = await SongGenre.findOne({
        where: {SongId: +id, GenreId: +genreId}
      });
      if (!songGenre) throw {name: "NotFoundError"};
      await SongGenre.destroy({where: {SongId: +id, GenreId: +genreId}});
      res.status(200).json({
        message: "Successfully removed song genre"
      });
    } catch(err) {
      next(err);
    }
  }

  static async addSongArtist(req, res, next) {
    try {
      const { id, artistId } = req.params;
      const { role } = req.body;
      if (isNaN(id) || isNaN(artistId)) throw {name: "NotFoundError"};
      const [song, artist] = await Promise.all([
        Song.findByPk(+id),
        Artist.findByPk(+artistId)
      ]);
      if (!song || !artist) throw {name: "NotFoundError"};
      await SongArtist.create({SongId: +id, ArtistId: +artistId, role});
      res.status(201).json({
        message: "Successfully added artist to song"
      });
    } catch(err) {
      next(err);
    }
  }
  static async deleteSongArtist(req, res, next) {
    try {
      const { id, artistId } = req.params;
      if (isNaN(id) || isNaN(artistId)) throw {name: "NotFoundError"};
      const songArtist = await SongArtist.findOne({
        where: {SongId: +id, ArtistId: +artistId}
      });
      if (!songArtist) throw {name: "NotFoundError"};
      await SongArtist.destroy({where: {SongId: +id, ArtistId: +artistId}});
      res.status(200).json({
        message: "Successfully removed artist from song"
      });
    } catch(err) {
      next(err);
    }
  }
  static async editSongArtistRole(req, res, next) {
    try {
      const { id, artistId } = req.params;
      const { role } = req.body;
      if (isNaN(id) || isNaN(artistId)) throw {name: "NotFoundError"};
      const [numRecordsUpdated, songArtists] = await SongArtist.update(
        { role },
        { where: {SongId: +id, ArtistId: +artistId}, returning: true }
      );
      if (numRecordsUpdated === 0) throw {name: 'NotFoundError'};
      res.status(200).json({
        message: "Successfully updated artist"
      });
    } catch(err) {
      next(err);
    }
  }

}

module.exports = SongController;
