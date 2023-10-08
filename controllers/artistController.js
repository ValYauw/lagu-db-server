const { 
  User,
  Genre, Song, Artist, Album,
  SongGenre, SongArtist, AlbumSong,
  PlayLink, ArtistLink, sequelize
} = require("../models");
const {Op} = require('sequelize');

class ArtistController {

  static async getArtists(req, res, next) {
    try {

      let { limit, offset } = req.query;
      offset = +offset || 0;
      limit = limit || 20;
      if (isNaN(limit) || isNaN(offset)) throw {name: 'BadCredentials'};
      if (limit > 100) limit = 100;

      const artists = await Artist.findAndCountAll({
        order: [['name', 'ASC']],
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
          include: [
            [sequelize.cast(sequelize.literal(
              '(SELECT COUNT("SongArtist"."id") FROM "SongArtists" AS "SongArtist" WHERE "SongArtist"."ArtistId" = "Artist"."id")'
            ), 'integer'), "numSongs"]
          ]
        },
        limit, offset
      });
      res.status(200).json({
        count: artists.count,
        offset,
        data: artists.rows
      });
    } catch (err) {
      next(err)
    }
  }

  static async getArtistById(req, res, next) {
    try {
      const { id } = req.params;
      if (isNaN(id)) throw {name: 'NotFoundError'};
      const artist = await Artist.findOne({
        where: {id: +id},
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
        include: {
          model: ArtistLink,
          as: 'links',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'ArtistId']
          }
        }
      });
      if (!artist) throw {name: 'NotFoundError'}
      res.status(200).json(artist);
    } catch (err) {
      next(err)
    }
  }

  static async getArtistSongs(req, res, next) {
    try {
      const { id } = req.params;
      if (isNaN(id)) throw {name: 'NotFoundError'};

      let { limit, offset } = req.query;
      offset = +offset || 0;
      limit = limit || 20;
      if (isNaN(limit) || isNaN(offset)) throw {name: 'BadCredentials'};
      if (limit > 100) limit = 100;

      const artist = await Artist.findOne({where: { id: +id }});
      if (!artist) throw {name: 'NotFoundError'};

      const { count, rows: songIds } = await SongArtist.findAndCountAll({
        attributes: ['SongId'],
        where: {ArtistId: +id},
        distinct: true,
        limit, offset
      });

      const songs = await Song.findAll({
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
        order: [['name', 'ASC']],
        where: {id: songIds.map(el => el.dataValues.SongId)},
        include: [
          {
            model: Artist,
            as: 'artists',
            attributes: ['id', 'name', 'aliases'],
            through: { attributes: [] }
          },
          // {
          //   model: Genre,
          //   attributes: ['id', 'name'],
          //   through: {attributes: []}
          // },
          {
            model: PlayLink,
            as: 'links',
            attributes: ['id', 'songURL', 'isInactive']
          }
        ]
      });

      res.status(200).json({
        count, offset, data: songs
      });
    } catch(err) {
      next(err)
    }
  }

  static async getArtistAlbums(req, res, next) {
    try {
      const { id } = req.params;
      if (isNaN(id)) throw {name: 'NotFoundError'};

      let { limit, offset } = req.query;
      offset = +offset || 0;
      limit = limit || 20;
      if (isNaN(limit) || isNaN(offset)) throw {name: 'BadCredentials'};
      if (limit > 100) limit = 100;

      const artist = await Artist.findOne({where: { id: +id }});
      if (!artist) throw {name: 'NotFoundError'};

      let [[{count}], albums] = await Promise.all([
        sequelize.query(`
          SELECT COUNT(DISTINCT("Album.id"))::INTEGER AS "count"
          FROM "ConsolidatedArtistAlbumSongs"
          WHERE "Artist.id" = $$1`, 
          {
            bind: [id],
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
            "Album.description" AS "description"
          FROM "ConsolidatedArtistAlbumSongs"
          WHERE "Artist.id" = $$1
          ORDER BY "name" ASC
          LIMIT $$2 OFFSET $$3;
          `, 
          {
            bind: [id, limit, offset],
            type: sequelize.QueryTypes.SELECT
            // logging: () => {console.log('Querying albums');}
          })
      ]);

      res.status(200).json({
        count, offset, data: albums
      });

    } catch(err) {
      next(err);
    }
  }

  static async addArtist(req, res, next) {
    const t = await sequelize.transaction();
    try {
      let { name, aliases, imageURL, description, artistLinks } = req.body;

      // Main Entity
      if (!aliases?.length) aliases = null;
      let artist = await Artist.create(
        { name, aliases, imageURL, description },
        { transaction: t }
      );

      // Artist Link Nested Resource
      if (artistLinks && artistLinks?.length) {
        const addArtistLinks = artistLinks.map(artistLink => {
          const { webURL, description, isInactive } = artistLink;
          return { webURL, description, isInactive, ArtistId: artist.id };
        })
        await ArtistLink.bulkCreate(addArtistLinks, { transaction: t });
      }
      await t.commit();

      // Get created resource
      artist = await Artist.findOne({
        where: {id: artist.id},
        include: { model: ArtistLink }
      });
      res.status(201).json(artist);

    } catch(err) {
      await t.rollback();
      next(err);
    }
  }
  static async editArtist(req, res, next) {
    try {
      const { id } = req.params;
      let { name, aliases, imageURL, description } = req.body;
      if (!aliases?.length) aliases = null;      
      let [numUpdated, song] = await Artist.update(
        {name, aliases, imageURL, description}, 
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
  static async deleteArtist(req, res, next) {
    try {
      const { id } = req.params;
      let artist = await Artist.findOne({where: {id: +id}});
      if (!artist) throw { name: 'NotFoundError' };
      await Artist.destroy({
        where: {id: +id}
      });
      res.status(200).json({
        message: "Successfully deleted"
      })
    } catch(err) {
      next(err);
    }
  }

  // static async addArtistLink(req, res, next) {
  //   try {
  //     const { id: ArtistId } = req.params;
  //     const { webURL, description, isInactive } = req.body;
  //     const artist = await Artist.findByPk(+ArtistId);
  //     if (!artist) throw { name: 'NotFoundError' }
  //     await ArtistLink.create({ webURL, description, isInactive, ArtistId });
  //     res.status(201).json({
  //       message: 'Added new artist link'
  //     })
  //   } catch(err) {
  //     next(err);
  //   }
  // }
  // // static async editArtistLink(req, res, next) {

  // // }
  // static async deleteArtistLink(req, res, next) {
  //   try {
  //     const { id, linkId } = req.params;
  //     const artistLink = await ArtistLink.findOne({where: {id: +linkId}});
  //     if (!artistLink || artistLink.ArtistId !== +id) throw { name: 'NotFoundError' };
  //     await ArtistLink.destroy({where: {id: +linkId}});
  //     res.status(200).json({
  //       message: 'Removed artist link'
  //     })
  //   } catch(err) {
  //     next(err);
  //   }
  // }

}

module.exports = ArtistController;
