'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.sequelize.query(`
    CREATE VIEW "ConsolidatedArtistAlbumSongs" AS 
      (SELECT
        "Songs"."id" AS "Song.id", 
        "Songs"."name" AS "Song.name", 
        "Songs"."aliases" AS "Song.aliases",
        "Songs"."releaseDate" AS "Song.releaseDate",
        "Songs"."songType" AS "Song.songType",
        "Songs"."parentId" AS "Song.parentId",
        "Artists"."id" AS "Artist.id",
        "Artists"."name" AS "Artist.name",
        "Artists"."aliases" AS "Artist.aliases",
        "Artists"."imageURL" AS "Artist.imageURL",
        "Artists"."description" AS "Artist.description",
        "SongArtists"."role" AS "Artist.role",
        "Albums"."id" AS "Album.id",
        "Albums"."name" AS "Album.name",
        "Albums"."aliases" AS "Album.aliases",
        "Albums"."imageURL" AS "Album.imageURL",
        "Albums"."releaseDate" AS "Album.releaseDate",
        "Albums"."description" AS "Album.description",
        "AlbumSongs"."discNumber" AS "Album.discNumber",
        "AlbumSongs"."trackNumber" AS "Album.trackNumber"
      FROM
        "Albums" INNER JOIN (
          "AlbumSongs" INNER JOIN (
            "Songs" INNER JOIN (
              "SongArtists" INNER JOIN "Artists"
              ON "SongArtists"."ArtistId" = "Artists"."id"
            ) ON "Songs"."id" = "SongArtists"."SongId" 
          ) ON "AlbumSongs"."SongId" = "Songs"."id" 
        ) ON "Albums"."id" = "AlbumSongs"."AlbumId"
      );
    `);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.sequelize.query("DROP VIEW \"ConsolidatedArtistAlbumSongs\"");
  }
};
