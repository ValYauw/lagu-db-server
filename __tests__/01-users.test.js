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
/* 
 * END SEED DATA
 */

beforeAll(async () => {
  await sequelize.queryInterface.bulkInsert('Users', users.map(el => {
    return {...el, password: encrypt(el.password)}
  }));
})

afterAll(async () => {
  await sequelize.queryInterface.bulkDelete('Users', null, {
    restartIdentity: true,
    cascade: true,
    truncate: true
  });
})

describe('POST User login', () => {

  it('should log the user in with their email', async () => {
    const response = await request(app)
      .post(entrypoints.login)
      .send({
        email: users[0].email,
        password: users[0].password
      })
    expect(response.statusCode).toBe(200);
    const { access_token } = response.body;
    expect(access_token).toBeDefined();
  });

  it('should give an invalid response (no matching email)', async () => {
    const response = await request(app)
      .post(entrypoints.login)
      .send({
        email: 'bo.johnson@mail.com',
        password: 'password'
      })
    expect(response.statusCode).toBe(401);
    const { access_token, message } = response.body;
    expect(access_token).toBeUndefined();
    expect(message).toBeDefined();
  });

  it('should give an invalid response (wrong password)', async () => {
    const response = await request(app)
      .post(entrypoints.login)
      .send({
        email: users[0].email,
        password: 'wrongpass'
      })
    expect(response.statusCode).toBe(401);
    const { access_token, message } = response.body;
    expect(access_token).toBeUndefined();
    expect(message).toBeDefined();
  });

  it('should give an invalid response (data is undefined)', async () => {
    const response = await request(app)
      .post(entrypoints.login)
      .send({})
    expect(response.statusCode).toBe(401);
    const { access_token, message } = response.body;
    expect(access_token).toBeUndefined();
    expect(message).toBeDefined();
  });

  it('should give an invalid response (email is empty)', async () => {
    const response = await request(app)
      .post(entrypoints.login)
      .send({
        email: '',
        password: 'password'
      })
    expect(response.statusCode).toBe(401);
    const { access_token, message } = response.body;
    expect(access_token).toBeUndefined();
    expect(message).toBeDefined();
  });

  it('should give an invalid response (password is empty)', async () => {
    const response = await request(app)
      .post(entrypoints.login)
      .send({
        email: users[0].email,
        password: ''
      })
    expect(response.statusCode).toBe(401);
    const { access_token, message } = response.body;
    expect(access_token).toBeUndefined();
    expect(message).toBeDefined();
  });

})

describe('POST User register', () => {

  it('should register the user', async () => {
    const response = await request(app)
      .post(entrypoints.register)
      .send({
        username: 'Jill Jones',
        email: "jill.jones@gmail.com",
        password: "password",
      })
    expect(response.statusCode).toBe(201);
    const { message } = response.body;
    expect(message).toBeDefined();

    const loginResponse = await request(app)
      .post(entrypoints.login)
      .send({
        email: 'jill.jones@gmail.com',
        password: 'password'
      })
    expect(loginResponse.statusCode).toBe(200);
    expect(loginResponse?.body?.access_token).toBeDefined();
  });

  it('should fail to register (data is undefined)', async () => {
    const response = await request(app)
      .post(entrypoints.register)
      .send({})
    expect(response.statusCode).toBe(400);
    const { message } = response.body;
    expect(message).toBeDefined();
  });

  it('should fail to register (username is empty)', async () => {
    const response = await request(app)
      .post(entrypoints.register)
      .send({
        username: "",
        email: "bowers@mail.com",
        password: "password",
      })
    expect(response.statusCode).toBe(400);
    const { message } = response.body;
    expect(message).toBeDefined();
    expect(message).toBe("Username is required");
  });

  it('should fail to register (email is empty)', async () => {
    const response = await request(app)
      .post(entrypoints.register)
      .send({
        username: "Bowers",
        email: "",
        password: "password",
      })
    expect(response.statusCode).toBe(400);
    const { message } = response.body;
    expect(message).toBeDefined();
    expect(message).toBe("Email is required");
  });

  it('should fail to register (password is empty)', async () => {
    const response = await request(app)
      .post(entrypoints.register)
      .send({
        username: "Bowers",
        email: "bowers@mail.com",
        password: "",
      })
    expect(response.statusCode).toBe(400);
    const { message } = response.body;
    expect(message).toBeDefined();
    expect(message).toBe("Password is required");
  });

  it('should fail to register (password is too short)', async () => {
    const response = await request(app)
      .post(entrypoints.register)
      .send({
        username: "Bowers",
        email: "bowers@mail.com",
        password: "1234567",
      })
    expect(response.statusCode).toBe(400);
    const { message } = response.body;
    expect(message).toBeDefined();
    expect(message).toBe("Password must be at least 8 characters long");
  });

  it('should fail to register (username is already registered)', async () => {
    const response = await request(app)
      .post(entrypoints.register)
      .send({
        username: "John Doe",
        email: "jdoe@mail.com",
        password: "password",
      })
    expect(response.statusCode).toBe(400);
    const { message } = response.body;
    expect(message).toBeDefined();
    expect(message).toBe("Username is already registered");
  });

  it('should fail to register (email is already registered)', async () => {
    const response = await request(app)
      .post(entrypoints.register)
      .send({
        username: "JM Doe",
        email: "john.doe@mail.com",
        password: "password",
      })
    expect(response.statusCode).toBe(400);
    const { message } = response.body;
    expect(message).toBeDefined();
    expect(message).toBe("Email is already registered");
  });

})