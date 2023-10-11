const request = require('supertest');
const app = require('../app');
const { encrypt } = require('../helpers/encrypt'); 
const { sequelize } = require('../models');
const entrypoints = require('../config/testing-entrypoints');

const dummyDate = new Date('2020-01-01T00:00:00');

/* 
 * START SEED DATA
 */
const users = [
  {
    username: "John Doe",
    email: "john.doe@mail.com",
    password: "password",
    role: "Admin",
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
  {
    username: "Jane Doe",
    email: "jane.doe@mail.com",
    password: "password",
    role: "Staff",
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
  {
    username: "Jack Doe",
    email: "jack.doe@mail.com",
    password: "password",
    role: "User",
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
];
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
    name: "K-Pop",
    parentId: 1,
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
  {
    name: "C-Pop",
    parentId: 1,
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
  {
    name: "J-Pop",
    parentId: 1,
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
  {
    name: "Hard Rock",
    parentId: 2,
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
  {
    name: "Punk",
    parentId: 2,
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
  {
    name: "Industrial Rock",
    parentId: 2,
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
  {
    name: "Post Rock",
    parentId: 2,
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
  {
    name: "Shoegaze",
    parentId: 2,
    createdAt: dummyDate,
    updatedAt: dummyDate
  }
];
/* 
 * END SEED DATA
 */

let admin_access_token;
let staff_access_token;
let user_access_token;
beforeAll(async () => {

  await sequelize.queryInterface.bulkInsert('Users', users.map(el => {
    return {...el, password: encrypt(el.password)}
  }));
  await sequelize.queryInterface.bulkInsert('Genres', genres);

  let response;
  response = await request(app)
    .post(entrypoints.login)
    .send({
      email: users[0].email,
      password: users[0].password
    });
  console.log(response);
  admin_access_token = response.body.access_token;
  
  response = await request(app)
    .post(entrypoints.login)
    .send({
      email: users[1].email,
      password: users[1].password
    });
  staff_access_token = response.body.access_token;

  response = await request(app)
    .post(entrypoints.login)
    .send({
      email: users[2].email,
      password: users[2].password
    });
  user_access_token = response.body.access_token;

});

afterAll(async () => {
  ['Users', 'Genres'].forEach(async (tableName) => {
    await sequelize.queryInterface.bulkDelete(tableName, null, {
      restartIdentity: true,
      cascade: true,
      truncate: true
    });
  });
});

describe('GET genres', () => {

  it('should get the list of genres as a JSON tree', async () => {
    const response = await request(app)
      .get(entrypoints.genres)
    expect(response.statusCode).toBe(200);
    const data = response.body;
    expect(data).toBeDefined();
    expect(data.length).toBe(2);
    expect(data[0].name).toBe('Pop');
    expect(data[1].name).toBe('Rock');
    const popSubGenres = data[0].subGenres;
    const rockSubGenres = data[1].subGenres;
    expect(popSubGenres).toBeDefined();
    expect(rockSubGenres).toBeDefined();
    expect(popSubGenres.length).toBe(3);
    expect(rockSubGenres.length).toBe(5);
    expect(popSubGenres[0].name).toBeDefined();
    expect(popSubGenres[0].subGenres).toBeUndefined();
    expect(popSubGenres).toEqual([
      { id: 4, name: 'C-Pop' },
      { id: 5, name: 'J-Pop' },
      { id: 3, name: 'K-Pop' }
    ]);
    expect(rockSubGenres).toEqual([
      { id: 6, name: 'Hard Rock' },
      { id: 8, name: 'Industrial Rock' },
      { id: 9, name: 'Post Rock' },
      { id: 7, name: 'Punk' },
      { id: 10, name: 'Shoegaze' }
    ]);
  });

  it('should get a genre and its sub-genres', async () => {
    const response = await request(app)
      .get(entrypoints.genres + '/1')
    expect(response.statusCode).toBe(200);
    const data = response.body;
    expect(data.name).toBe('Pop');
    expect(data.parentGenre).toBeNull();
    expect(data.subGenres).toBeDefined();
    const popSubGenres = data.subGenres;
    expect(popSubGenres.length).toBe(3);
    expect(popSubGenres[0].name).toBeDefined();
    expect(popSubGenres[0].subGenres).toBeUndefined();
    expect(popSubGenres).toEqual([
      { id: 4, name: 'C-Pop' },
      { id: 5, name: 'J-Pop' },
      { id: 3, name: 'K-Pop' }
    ]);
  });

  it('should get a genre and its sub-genres', async () => {
    const response = await request(app)
      .get(entrypoints.genres + '/2')
    expect(response.statusCode).toBe(200);
    const data = response.body;
    expect(data.name).toBe('Rock');
    expect(data.parentGenre).toBeNull();
    expect(data.subGenres).toBeDefined();
    const rockSubGenres = data.subGenres;
    expect(rockSubGenres.length).toBe(5);
    expect(rockSubGenres[0].name).toBeDefined();
    expect(rockSubGenres[0].subGenres).toBeUndefined();
    expect(rockSubGenres).toEqual([
      { id: 6, name: 'Hard Rock' },
      { id: 8, name: 'Industrial Rock' },
      { id: 9, name: 'Post Rock' },
      { id: 7, name: 'Punk' },
      { id: 10, name: 'Shoegaze' }
    ]);
  });

  it('should get a genre and its sub-genres', async () => {
    const response = await request(app)
      .get(entrypoints.genres + '/3')
    expect(response.statusCode).toBe(200);
    const data = response.body;
    expect(data.name).toBe('K-Pop');
    expect(data.subGenres).toBeDefined();
    const subGenres = data.subGenres;
    expect(subGenres.length).toBe(0);
    expect(data.parentGenre).toBeDefined();
    expect(data.parentGenre.id).toBe(1);
    expect(data.parentGenre.name).toBe('Pop');
  });

  it('should fail to get a genre with invalid id', async () => {
    const response = await request(app)
      .get(entrypoints.genres + '/nan')
    expect(response.statusCode).toBe(404);
    const { message } = response.body;
    expect(message).toBeDefined();
    expect(message).toBe('Data not found');
  });

  it('should fail to get a genre with non-existent id', async () => {
    const response = await request(app)
      .get(entrypoints.genres + '/100')
    expect(response.statusCode).toBe(404);
    const { message } = response.body;
    expect(message).toBeDefined();
    expect(message).toBe('Data not found');
  });

});

describe('POST genre', () => {

  it('should successfully add a genre', async () => {

    const response = await request(app)
      .post(entrypoints.genres)
      .set('access_token', admin_access_token)
      .send({
        name: 'Electro-swing'
      });
    expect(response.statusCode).toBe(201);

    const fetchResponse = await request(app)
      .get(entrypoints.genres + '/11');
    expect(fetchResponse.statusCode).toBe(200);
    expect(fetchResponse.body.name).toBe('Electro-swing');
    expect(fetchResponse.body.subGenres).toEqual([]);
    expect(fetchResponse.body.parentGenre).toBeNull();

  });

  it('should successfully add a genre', async () => {

    const response = await request(app)
      .post(entrypoints.genres)
      .set('access_token', admin_access_token)
      .send({
        name: 'Emo',
        parentId: 2
      });
    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBeDefined();

    const fetchResponse = await request(app)
      .get(entrypoints.genres + '/12');
    expect(fetchResponse.statusCode).toBe(200);
    expect(fetchResponse.body.name).toBe('Emo');
    expect(fetchResponse.body.subGenres).toEqual([]);
    expect(fetchResponse.body.parentGenre).toBeDefined();
    expect(fetchResponse.body.parentGenre.id).toBe(2);
    expect(fetchResponse.body.parentGenre.name).toBe('Rock');

  });

  it('should fail to add a genre with a staff access token', async () => {
    const response = await request(app)
      .post(entrypoints.genres)
      .set('access_token', staff_access_token)
      .send({
        name: 'Folk'
      });
    expect(response.statusCode).toBe(403);
  });

  it('should fail to add a genre with a user access token', async () => {
    const response = await request(app)
      .post(entrypoints.genres)
      .set('access_token', user_access_token)
      .send({
        name: 'Kids'
      });
    expect(response.statusCode).toBe(403);
  });

  it('should fail to add a genre with no access token', async () => {
    const response = await request(app)
      .post(entrypoints.genres)
      .send({
        name: 'Bop'
      });
    expect(response.statusCode).toBe(401);
  });

  it('should fail to add a genre with invalid access token', async () => {
    const response = await request(app)
      .post(entrypoints.genres)
      .set('access_token', 'asdfgek')
      .send({
        name: 'Breakcore'
      });
    expect(response.statusCode).toBe(401);
  });

  it('should fail to add a genre if no name is given', async () => {
    const response = await request(app)
      .post(entrypoints.genres)
      .set('access_token', admin_access_token)
      .send({
        name: ''
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Genre name is required');
  });

  it('should fail to add a genre if no name is given', async () => {
    const response = await request(app)
      .post(entrypoints.genres)
      .set('access_token', admin_access_token)
      .send({ });
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Genre name is required');
  });

});

describe('PUT genre', () => {

  it('should successfully update a genre', async () => {

    const response = await request(app)
      .put(entrypoints.genres + '/12')
      .set('access_token', admin_access_token)
      .send({
        name: 'Surf Rock'
      });
    expect(response.statusCode).toBe(200);

    const fetchResponse = await request(app)
      .get(entrypoints.genres + '/12');
    expect(fetchResponse.statusCode).toBe(200);
    expect(fetchResponse.body.name).toBe('Surf Rock');
    expect(fetchResponse.body.subGenres).toEqual([]);
    expect(fetchResponse.body.parentGenre).toBeNull();

  });

  it('should successfully update a genre', async () => {

    const response = await request(app)
      .put(entrypoints.genres + '/12')
      .set('access_token', admin_access_token)
      .send({
        name: 'Stoner Rock',
        parentId: 2
      });
    expect(response.statusCode).toBe(200);

    const fetchResponse = await request(app)
      .get(entrypoints.genres + '/12');
    expect(fetchResponse.statusCode).toBe(200);
    expect(fetchResponse.body.name).toBe('Stoner Rock');
    expect(fetchResponse.body.subGenres).toEqual([]);
    expect(fetchResponse.body.parentGenre).toBeDefined();
    expect(fetchResponse.body.parentGenre.id).toBe(2);
    expect(fetchResponse.body.parentGenre.name).toBe('Rock');

  });

  it('should fail to update a genre with a staff access token', async () => {
    const response = await request(app)
      .put(entrypoints.genres + '/12')
      .set('access_token', staff_access_token)
      .send({
        name: 'Metalcore'
      });
    expect(response.statusCode).toBe(403);
  });

  it('should fail to update a genre with a user access token', async () => {
    const response = await request(app)
      .put(entrypoints.genres + '/12')
      .set('access_token', user_access_token)
      .send({
        name: 'Kids'
      });
    expect(response.statusCode).toBe(403);
  });

  it('should fail to update a genre with no access token', async () => {
    const response = await request(app)
      .put(entrypoints.genres + '/12')
      .send({
        name: 'Bop'
      });
    expect(response.statusCode).toBe(401);
  });

  it('should fail to update a genre with invalid access token', async () => {
    const response = await request(app)
      .put(entrypoints.genres + '/12')
      .set('access_token', 'asdfgek')
      .send({
        name: 'Breakcore'
      });
    expect(response.statusCode).toBe(401);
  });

  it('should fail to update a genre if no name is given', async () => {
    const response = await request(app)
      .put(entrypoints.genres + '/12')
      .set('access_token', admin_access_token)
      .send({
        name: ''
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Genre name is required');
  });

  it('should fail to update a genre if no name is given', async () => {
    const response = await request(app)
      .put(entrypoints.genres + '/12')
      .set('access_token', admin_access_token)
      .send({ });
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Genre name is required');
  });

});

describe('DELETE genre', () => {

  it('should successfully delete a genre', async () => {

    const response = await request(app)
      .delete(entrypoints.genres + '/1')
      .set('access_token', admin_access_token);
    expect(response.statusCode).toBe(200);

    let fetchResponse = await request(app).get(entrypoints.genres + '/1');
    expect(fetchResponse.statusCode).toBe(404);
    fetchResponse = await request(app).get(entrypoints.genres + '/3');
    expect(fetchResponse.statusCode).toBe(200);
    expect(fetchResponse.body.name).toBe('K-Pop');
    expect(fetchResponse.body.parentGenre).toBeNull();

  });

  it('should fail to delete a genre with a staff access token', async () => {
    const response = await request(app)
      .delete(entrypoints.genres + '/2')
      .set('access_token', staff_access_token);
    expect(response.statusCode).toBe(403);
  });

  it('should fail to delete a genre with a user access token', async () => {
    const response = await request(app)
      .delete(entrypoints.genres + '/3')
      .set('access_token', user_access_token);
    expect(response.statusCode).toBe(403);
  });

  it('should fail to delete a genre with no access token', async () => {
    const response = await request(app)
      .delete(entrypoints.genres + '/4');
    expect(response.statusCode).toBe(401);
  });

  it('should fail to delete a genre with invalid access token', async () => {
    const response = await request(app)
      .delete(entrypoints.genres + '/5')
      .set('access_token', 'asdfgek');
    expect(response.statusCode).toBe(401);
  });

  it('should fail to delete a genre with an invalid id', async () => {
    const response = await request(app)
      .delete(entrypoints.genres + '/nan')
      .set('access_token', admin_access_token);
    expect(response.statusCode).toBe(404);
  });

  it('should fail to delete a genre with a non-existent id', async () => {
    const response = await request(app)
      .delete(entrypoints.genres + '/100')
      .set('access_token', admin_access_token);
    expect(response.statusCode).toBe(404);
  });

});