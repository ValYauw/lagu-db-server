const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');
const entrypoints = require('../config/testing-entrypoints');

const dummyDate = new Date('2020-01-01T00:00:00');

beforeAll(async () => {
  await sequelize.queryInterface.bulkInsert('Artists', 
    Array(40).fill('').map((el, index) => {
      return {
        name: `Artist ${`${index+1}`.padStart(2, '0')}`,
        createdAt: dummyDate,
        updatedAt: dummyDate
      }
    })
  );
});

afterAll(async () => {
  ['Artists'].forEach(async (tableName) => {
    await sequelize.queryInterface.bulkDelete(tableName, null, {
      restartIdentity: true,
      cascade: true,
      truncate: true
    });
  });
});

describe('GET artists', () => {

  it('should get the first page for musical artists', async () => {
    const response = await request(app)
      .get(entrypoints.artists + '?limit=10')
    expect(response.statusCode).toBe(200);
    const { count, offset, data } = response.body;
    expect(count).toBeDefined();
    expect(offset).toBeDefined();
    expect(data).toBeDefined();
    expect(count).toBe(40);
    expect(offset).toBe(0);
    expect(data.length).toBe(10);
    const artist = data[0];
    const { id, name, aliases, imageURL, description, numSongs } = artist;
    expect(id).toBeDefined();
    expect(id).toBe(1);
    expect(name).toBeDefined();
    expect(aliases).toBeDefined();
    expect(imageURL).toBeDefined();
    expect(description).toBeDefined();
    expect(numSongs).toBeDefined();
  });

  it('should get the second page for musical artists', async () => {
    const response = await request(app)
      .get(entrypoints.artists + '?limit=10&offset=10')
    expect(response.statusCode).toBe(200);
    const { count, offset, data } = response.body;
    expect(count).toBeDefined();
    expect(offset).toBeDefined();
    expect(data).toBeDefined();
    expect(count).toBe(40);
    expect(offset).toBe(10);
    expect(data.length).toBe(10);
    const artist = data[0];
    const { id, name, aliases, imageURL, description, numSongs } = artist;
    expect(id).toBeDefined();
    expect(id).toBe(11);
    expect(name).toBeDefined();
    expect(aliases).toBeDefined();
    expect(imageURL).toBeDefined();
    expect(description).toBeDefined();
    expect(numSongs).toBeDefined();
  });

});