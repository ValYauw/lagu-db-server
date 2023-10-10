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
    name: 'Hatsune Miku',
    aliases: ['Miku Hatsune', 'CV-01'],
    createdAt: dummyDate,
    updatedAt: dummyDate
  }
];

/* 
 * END SEED DATA
 */

beforeAll(async () => {
  await sequelize.queryInterface.bulkInsert('Artists', artists);
  await sequelize.queryInterface.bulkInsert('Songs', 
    Array(40).fill('').map((el, index) => {
      return {
        name: `Song ${`${index+1}`.padStart(2, '0')}`,
        aliases: null,
        releaseDate: new Date('2013-05-21T00:00:00'),
        songType: 'Original',
        parentId: null,
        createdAt: dummyDate,
        updatedAt: dummyDate
      }
    })
  );
  await sequelize.queryInterface.bulkInsert('SongArtists', 
    Array(40).fill('').map((el, index) => {
      return {
        SongId: index+1,
        ArtistId: 1,
        role: 'Vocalist',
        createdAt: dummyDate,
        updatedAt: dummyDate
      }
    })
  );
});

afterAll(async () => {
  ['Artists', 'Songs', 'SongArtists'].forEach(async (tableName) => {
    await sequelize.queryInterface.bulkDelete(tableName, null, {
      restartIdentity: true,
      cascade: true,
      truncate: true
    });
  });
});

describe('GET artist songs', () => {

  it('should get the list of songs for an artist', async () => {
    const response = await request(app)
      .get(entrypoints.artists + '/1/songs')
    expect(response.statusCode).toBe(200);
    const { count, offset, data } = response.body;
    expect(count).toBeDefined();
    expect(offset).toBeDefined();
    expect(data).toBeDefined();
    expect(count).toBe(40);
    expect(offset).toBe(0);
    expect(data.length).toBe(20);
    const { id, name, aliases, releaseDate, songType, artists, links } = data[0];
    expect(id).toBeDefined();
    expect(id).toBe(1);
    expect(name).toBeDefined();
    expect(aliases).toBeDefined();
    expect(releaseDate).toBeDefined();
    expect(songType).toBeDefined();
    expect(artists).toBeDefined();
    expect(links).toBeDefined();
  });

  it('should support pagination for list of songs for an artist', async () => {
    const response = await request(app)
      .get(entrypoints.artists + '/1/songs?limit=10&offset=5')
    expect(response.statusCode).toBe(200);
    const { count, offset, data } = response.body;
    expect(count).toBeDefined();
    expect(offset).toBeDefined();
    expect(data).toBeDefined();
    expect(count).toBe(40);
    expect(offset).toBe(5);
    expect(data.length).toBe(10);
    const { id, name, aliases, releaseDate, songType, artists, links } = data[0];
    expect(id).toBeDefined();
    expect(id).toBe(6);
    expect(name).toBeDefined();
    expect(aliases).toBeDefined();
    expect(releaseDate).toBeDefined();
    expect(songType).toBeDefined();
    expect(artists).toBeDefined();
    expect(links).toBeDefined();
  });

  it('should fail to get the list of songs for an artist with an invalid id', async () => {
    const response = await request(app)
      .get(entrypoints.artists + '/nan/songs')
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBeDefined();
  });

  it('should fail to get the list of songs for a non-existent artist', async () => {
    const response = await request(app)
      .get(entrypoints.artists + '/100/songs')
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBeDefined();
  });

});