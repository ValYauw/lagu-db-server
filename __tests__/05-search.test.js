const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');
const entrypoints = require('../config/testing-entrypoints');

const dummyDate = new Date('2020-01-01T00:00:00');

/* 
 * START SEED DATA
 */
const artists = [
  {
    name: 'Taylor Swift',
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
  {
    name: 'Hatsune Miku',
    createdAt: dummyDate,
    updatedAt: dummyDate
  }
]

/* 
 * END SEED DATA
 */

beforeAll(async () => {
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
  await sequelize.queryInterface.bulkInsert('PlayLinks', Array(40).fill('').map((el, index) => {
    return {
      songURL: 'https://www.youtube.com/watch?v=OaYCiSmfCsQ',
      isInactive: false,
      SongId: Math.floor(index / 2) + 1,
      createdAt: dummyDate,
      updatedAt: dummyDate
    }
  }));
  await sequelize.queryInterface.bulkInsert('SongArtists', Array(40).fill('').map((el, index) => {
    return {
      SongId: Math.floor(index / 2) + 1,
      ArtistId: index % 2 + 1,
      role: 'Artist',
      createdAt: dummyDate,
      updatedAt: dummyDate
    }
  }));
});

afterAll(async () => {
  ['Artists', 'Songs', 'PlayLinks', 'SongArtists'].forEach(async (tableName) => {
    await sequelize.queryInterface.bulkDelete(tableName, null, {
      restartIdentity: true,
      cascade: true,
      truncate: true
    });
  });
});

describe('GET search results', () => {

  it('should successfully search songs by title', async () => {
    const response = await request(app)
      .get(entrypoints.searchSongs + '?title=song')
    expect(response.statusCode).toBe(200);
    const { count, offset, data } = response.body;
    expect(count).toBeDefined();
    expect(offset).toBeDefined();
    expect(data).toBeDefined();
    expect(count).toBe(20);
    expect(offset).toBe(0);
    expect(data.length).toBe(20);
    const { name, alias } = data[0];
    expect(name).toBeDefined();
    expect(alias).toBeDefined();
  });

  it('should successfully search artists by name', async () => {
    const response = await request(app)
      .get(entrypoints.searchArtists + '?title=mik')
    expect(response.statusCode).toBe(200);
    const { count, offset, data } = response.body;
    expect(count).toBeDefined();
    expect(offset).toBeDefined();
    expect(data).toBeDefined();
    expect(count).toBe(1);
    expect(offset).toBe(0);
    expect(data.length).toBe(1);
    const { name, alias } = data[0];
    expect(name).toBeDefined();
    expect(alias).toBeDefined();
  });

  it('should successfully search songs by title, even if no results are found', async () => {
    const response = await request(app)
      .get(entrypoints.searchSongs + '?title=foobar')
    expect(response.statusCode).toBe(200);
    const { count, offset, data } = response.body;
    expect(count).toBeDefined();
    expect(offset).toBeDefined();
    expect(data).toBeDefined();
    expect(count).toBe(0);
    expect(offset).toBe(0);
    expect(data.length).toBe(0);
  });

  it('should support pagination for song search results', async () => {
    const response = await request(app)
      .get(entrypoints.searchSongs + '?title=song&limit=5&offset=5')
    expect(response.statusCode).toBe(200);
    const { count, offset, data } = response.body;
    expect(count).toBeDefined();
    expect(offset).toBeDefined();
    expect(data).toBeDefined();
    expect(count).toBe(20);
    expect(offset).toBe(5);
    expect(data.length).toBe(5);
    const { id, name, alias } = data[0];
    expect(id).toBeDefined();
    expect(id).toBe(6);
    expect(name).toBeDefined();
    expect(alias).toBeDefined();
  });

});