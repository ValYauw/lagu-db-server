const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');
const entrypoints = require('../config/testing-entrypoints');

const dummyDate = new Date('2020-01-01T00:00:00');

/* 
 * START SEED DATA
 */
const genres = [
  {
    name: "Pop",
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
  {
    name: "Rock",
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
  {
    name: "VOCALOID",
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
];
const artists = [
  {
    name: 'Taylor Swift',
    createdAt: dummyDate,
    updatedAt: dummyDate
  }
]

/* 
 * END SEED DATA
 */

beforeAll(async () => {
  await sequelize.queryInterface.bulkInsert('Genres', genres);
  await sequelize.queryInterface.bulkInsert('Artists', artists);
  await sequelize.queryInterface.bulkInsert('Songs', Array(20).fill('').map((el, index) => {
    return {
      name: `Song #${`${index+1}`.padStart(2)}`,
      aliases: null,
      releaseDate: new Date('2013-05-21T00:00:00'),
      songType: 'Original',
      parentId: null,
      createdAt: dummyDate,
      updatedAt: dummyDate
    }
  }));
  await sequelize.queryInterface.bulkInsert('SongGenres', Array(60).fill('').map((el, index) => {
    return {
      SongId: Math.floor(index / 3) + 1,
      GenreId: index % 3 + 1,
      createdAt: dummyDate,
      updatedAt: dummyDate
    }
  }));
  await sequelize.queryInterface.bulkInsert('PlayLinks', Array(40).fill('').map((el, index) => {
    return {
      songURL: 'https://www.youtube.com/watch?v=OaYCiSmfCsQ',
      isInactive: false,
      SongId: Math.floor(index / 2) + 1,
      createdAt: dummyDate,
      updatedAt: dummyDate
    }
  }));
  await sequelize.queryInterface.bulkInsert('SongArtists', Array(20).fill('').map((el, index) => {
    return {
      SongId: index+1,
      ArtistId: 1,
      role: 'Artist',
      createdAt: dummyDate,
      updatedAt: dummyDate
    }
  }));
});

afterAll(async () => {
  ['Genres', 'Artists', 'Songs', 'SongGenres', 'PlayLinks', 'SongArtists'].forEach(async (tableName) => {
    await sequelize.queryInterface.bulkDelete(tableName, null, {
      restartIdentity: true,
      cascade: true,
      truncate: true
    });
  });
});

describe('GET songs by genre', () => {

  it('should get the list of songs by genre', async () => {
    const response = await request(app)
      .get(entrypoints.genres + '/1/songs')
    expect(response.statusCode).toBe(200);
    const { count, offset, data } = response.body;
    expect(count).toBeDefined();
    expect(offset).toBeDefined();
    expect(data).toBeDefined();
    expect(count).toBe(20);
    expect(offset).toBe(0);
    expect(data.length).toBe(20);
    const { name, aliases, releaseDate, songType, artists, links } = data[0];
    expect(name).toBeDefined();
    expect(aliases).toBeDefined();
    expect(releaseDate).toBeDefined();
    expect(songType).toBeDefined();
    expect(artists).toBeDefined();
    expect(links).toBeDefined();
    expect(artists?.length).toBe(1);
    expect(artists[0].name).toBe('Taylor Swift');
    expect(links?.length).toBe(2);
  });

  it('should get the list of songs by genre, per page', async () => {
    const response = await request(app)
      .get(entrypoints.genres + '/1/songs?limit=5&offset=10')
    expect(response.statusCode).toBe(200);
    const { count, offset, data } = response.body;
    expect(count).toBeDefined();
    expect(offset).toBeDefined();
    expect(data).toBeDefined();
    expect(count).toBe(20);
    expect(offset).toBe(10);
    expect(data.length).toBe(5);
    const { id, name, aliases, releaseDate, songType, artists, links } = data[0];
    expect(id).toBeDefined();
    expect(id).toBe(11);
    expect(name).toBeDefined();
    expect(aliases).toBeDefined();
    expect(releaseDate).toBeDefined();
    expect(songType).toBeDefined();
    expect(artists).toBeDefined();
    expect(links).toBeDefined();
  });

  it('should fail to get songs for a genre with invalid id', async () => {
    const response = await request(app)
      .get(entrypoints.genres + '/nan/songs')
    expect(response.statusCode).toBe(404);
    const { message } = response.body;
    expect(message).toBeDefined();
    expect(message).toBe('Data not found');
  });

  it('should fail to get songs for a genre with non-existent id', async () => {
    const response = await request(app)
      .get(entrypoints.genres + '/100/songs')
    expect(response.statusCode).toBe(404);
    const { message } = response.body;
    expect(message).toBeDefined();
    expect(message).toBe('Data not found');
  });

});