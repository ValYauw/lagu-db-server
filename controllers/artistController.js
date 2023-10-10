const { 
  User,
  Genre, Song, Artist,
  SongGenre, SongArtist,
  PlayLink, ArtistLink, sequelize
} = require("../models");
const updateSubResources = require('../helpers/updateSubResources');
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
        order: [['createdAt', 'DESC'], ['name', 'ASC']],
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
        order: [
          ['name', 'ASC'], 
          ['id', 'ASC']
        ],
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
  // static async getArtistAlbums(req, res, next) {
  //   try {
  //     const { id } = req.params;
  //     if (isNaN(id)) throw {name: 'NotFoundError'};

  //     let { limit, offset } = req.query;
  //     offset = +offset || 0;
  //     limit = limit || 20;
  //     if (isNaN(limit) || isNaN(offset)) throw {name: 'BadCredentials'};
  //     if (limit > 100) limit = 100;

  //     const artist = await Artist.findOne({where: { id: +id }});
  //     if (!artist) throw {name: 'NotFoundError'};

  //     let [[{count}], albums] = await Promise.all([
  //       sequelize.query(`
  //         SELECT COUNT(DISTINCT("Album.id"))::INTEGER AS "count"
  //         FROM "ConsolidatedArtistAlbumSongs"
  //         WHERE "Artist.id" = $$1`, 
  //         {
  //           bind: [id],
  //           type: sequelize.QueryTypes.SELECT
  //           // logging: () => {console.log('Querying albums');}
  //         }),
  //       sequelize.query(`
  //         SELECT DISTINCT
  //           "Album.id" AS "id", 
  //           "Album.name" AS "name", 
  //           "Album.aliases" AS "aliases", 
  //           "Album.imageURL" AS "imageURL", 
  //           "Album.releaseDate" AS "releaseDate", 
  //           "Album.description" AS "description"
  //         FROM "ConsolidatedArtistAlbumSongs"
  //         WHERE "Artist.id" = $$1
  //         ORDER BY "name" ASC
  //         LIMIT $$2 OFFSET $$3;
  //         `, 
  //         {
  //           bind: [id, limit, offset],
  //           type: sequelize.QueryTypes.SELECT
  //           // logging: () => {console.log('Querying albums');}
  //         })
  //     ]);

  //     res.status(200).json({
  //       count, offset, data: albums
  //     });

  //   } catch(err) {
  //     next(err);
  //   }
  // }
  static async addArtist(req, res, next) {
    const t = await sequelize.transaction();
    try {
      let { name, aliases, imageURL, description, links } = req.body;

      // Main Entity
      if (!aliases?.length) aliases = null;
      if (!imageURL) imageURL = null;
      let artist = await Artist.create(
        { name, aliases, imageURL, description },
        { transaction: t }
      );

      // Artist Link Nested Resource
      if (links && links?.length) {
        const addArtistLinks = links.map(link => {
          const { webURL, description, isInactive } = link;
          return { webURL, description, isInactive, ArtistId: artist.id };
        })
        await ArtistLink.bulkCreate(addArtistLinks, { 
          transaction: t,
          validate: true
        });
      }
      await t.commit();

      res.status(201).json({
        message: 'Successfully created artist'
      });

    } catch(err) {
      await t.rollback();
      next(err);
    }
  }
  static async editArtist(req, res, next) {
    const t = await sequelize.transaction();
    try {
      
      const { id } = req.params;
      if (!id || isNaN(id)) throw { name: 'NotFoundError' };
      let artist = await Artist.findByPk(id, {attributes: ['id']});
      if (!artist) throw { name: 'NotFoundError' };

      let { name, aliases, imageURL, description, links } = req.body;
      name = name || '';
      if (!aliases?.length) aliases = null; 
      links = links || [];

      // Main Entity
      await Artist.update(
        { name, aliases, imageURL, description }, 
        {
          where: {id: +id},
          transaction: t
        }
      );

      // Nested resource: Artists
      await updateSubResources({
        model: ArtistLink,
        foreignKey: 'ArtistId', 
        mainResourceId: artist.id, 
        resources: links, 
        transaction: t
      });

      await t.commit();
      res.status(200).json({
        message: 'Successfully edited artist'
      });

    } catch(err) {
      await t.rollback();
      next(err);
    }
  }
  static async deleteArtist(req, res, next) {
    try {
      const { id } = req.params;
      if (!id || isNaN(id)) throw { name: 'NotFoundError' };
      let artist = await Artist.findOne({where: {id: +id}});
      if (!artist) throw { name: 'NotFoundError' };
      await Artist.destroy({
        where: {id: +id}
      });
      res.status(200).json({
        message: "Successfully deleted artist"
      })
    } catch(err) {
      next(err);
    }
  }

}

module.exports = ArtistController;
