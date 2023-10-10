const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');
const entrypoints = require('../config/testing-entrypoints');

const dummyDate = new Date('2020-01-01T00:00:00');

beforeAll(async () => {
  await sequelize.queryInterface.bulkInsert('Songs', 
    Array(40).fill('').map((el, index) => {
      return {
        name: `Song ${`${index+1}`.padStart(2, '0')}`,
        aliases: null,
        releaseDate: new Date('2010-10-19T00:00:00'),
        songType: 'Original',
        parentId: null,
        createdAt: dummyDate,
        updatedAt: dummyDate
      }
    })
  );
});

afterAll(async () => {
  ['Songs'].forEach(async (tableName) => {
    await sequelize.queryInterface.bulkDelete(tableName, null, {
      restartIdentity: true,
      cascade: true,
      truncate: true
    });
  });
});

describe('GET songs', () => {

  it('should get the first page for songs', async () => {
    const response = await request(app)
      .get(entrypoints.songs + '?limit=10')
    expect(response.statusCode).toBe(200);
    const { count, offset, data } = response.body;
    expect(count).toBeDefined();
    expect(offset).toBeDefined();
    expect(data).toBeDefined();
    expect(count).toBe(40);
    expect(offset).toBe(0);
    expect(data.length).toBe(10);
    const song = data[0];
    const { id, name, aliases, releaseDate, songType, artists, links } = song;
    expect(name).toBeDefined();
    expect(id).toBe(1);
    expect(aliases).toBeDefined();
    expect(releaseDate).toBeDefined();
    expect(songType).toBeDefined();
    expect(artists).toBeDefined();
    expect(links).toBeDefined();
  });

  it('should get the second page for songs', async () => {
    const response = await request(app)
      .get(entrypoints.songs + '?limit=10&offset=10')
    expect(response.statusCode).toBe(200);
    const { count, offset, data } = response.body;
    expect(count).toBeDefined();
    expect(offset).toBeDefined();
    expect(data).toBeDefined();
    expect(count).toBe(40);
    expect(offset).toBe(10);
    expect(data.length).toBe(10);
    const song = data[0];
    const { id, name, aliases, releaseDate, songType, artists, links } = song;
    expect(name).toBeDefined();
    expect(id).toBe(11);
    expect(aliases).toBeDefined();
    expect(releaseDate).toBeDefined();
    expect(songType).toBeDefined();
    expect(artists).toBeDefined();
    expect(links).toBeDefined();
  });

});