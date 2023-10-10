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
    name: "VOCALOID",
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
];
const artists = [
  {
    name: 'Hatsune Miku',
    aliases: ['Miku Hatsune', 'CV-01'],
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
  {
    name: 'Eve',
    aliases: null,
    createdAt: dummyDate,
    updatedAt: dummyDate
  }
];
const songs = [
  {
    name: "ローリンガール",
    aliases: ["Rolling Girl"],
    releaseDate: new Date("2010-02-14T00:00:00"),
    songType: "Original",
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
  {
    name: "裏表ラバーズ",
    aliases: ["Ura Omote Lovers", "Two-Faced Lovers"],
    releaseDate: new Date("2009-08-29T00:00:00"),
    songType: "Original",
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
  {
    name: "アンハッピーリフレイン",
    aliases: ["Unhappy Refrain"],
    releaseDate: new Date("2011-05-02T00:00:00"),
    songType: "Original",
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
  {
    name: "ローリンガール",
    aliases: ["Rolling Girl"],
    releaseDate: new Date("2017-02-14T00:00:00"),
    songType: "Cover",
    parentId: 1,
    createdAt: dummyDate,
    updatedAt: dummyDate
  }
];
const playLinks = [
  {
    songURL: "https://www.nicovideo.jp/watch/sm9714351",
    isInactive: false,
    SongId: 1,
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
  {
    songURL: "https://www.youtube.com/watch?v=vnw8zURAxkU",
    isInactive: false,
    SongId: 1,
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
  {
    songURL: "https://www.nicovideo.jp/watch/sm8082467",
    isInactive: false,
    SongId: 2,
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
  {
    songURL: "https://www.youtube.com/watch?v=b_cuMcDWwsI",
    isInactive: false,
    SongId: 2,
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
  {
    songURL: "https://piapro.jp/t/NXYR",
    isInactive: false,
    SongId: 2,
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
  {
    songURL: "https://www.nicovideo.jp/watch/sm14330479",
    isInactive: false,
    SongId: 3,
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
  {
    songURL: "https://www.youtube.com/watch?v=uMlv9VWAxko",
    isInactive: false,
    SongId: 3,
    createdAt: dummyDate,
    updatedAt: dummyDate
  }
];
const songArtists = [
  {
    SongId: 1,
    ArtistId: 1,
    role: 'vocalist',
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
  {
    SongId: 2,
    ArtistId: 1,
    role: 'vocalist',
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
  {
    SongId: 3,
    ArtistId: 1,
    role: 'vocalist',
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
  {
    SongId: 4,
    ArtistId: 2,
    role: 'cover vocalist',
    createdAt: dummyDate,
    updatedAt: dummyDate
  }
];
const songGenres = [
  { SongId: 1, GenreId: 1, createdAt: dummyDate, updatedAt: dummyDate },
  { SongId: 1, GenreId: 3, createdAt: dummyDate, updatedAt: dummyDate },
  { SongId: 2, GenreId: 1, createdAt: dummyDate, updatedAt: dummyDate },
  { SongId: 2, GenreId: 3, createdAt: dummyDate, updatedAt: dummyDate },
  { SongId: 3, GenreId: 1, createdAt: dummyDate, updatedAt: dummyDate },
  { SongId: 3, GenreId: 3, createdAt: dummyDate, updatedAt: dummyDate },
  { SongId: 4, GenreId: 1, createdAt: dummyDate, updatedAt: dummyDate },
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
  await sequelize.queryInterface.bulkInsert('Artists', artists);
  await sequelize.queryInterface.bulkInsert('Songs', songs);
  await sequelize.queryInterface.bulkInsert('PlayLinks', playLinks);
  await sequelize.queryInterface.bulkInsert('SongGenres', songGenres);
  await sequelize.queryInterface.bulkInsert('SongArtists', songArtists);

  let response;
  response = await request(app)
    .post(entrypoints.login)
    .send({
      email: users[0].email,
      password: users[0].password
    });
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
  ['Users', 'Genres', 'Artists', 'Songs', 'PlayLinks', 'SongGenres', 'SongArtists'].forEach(async (tableName) => {
    await sequelize.queryInterface.bulkDelete(tableName, null, {
      restartIdentity: true,
      cascade: true,
      truncate: true
    });
  });
});

describe('PUT song genres', () => {

  it('should fail to update a song\'s genres with a user access token', async () => {

    const testData = {
      genres: [
        { id: 3 },
        { id: 2 }
      ]
    };

    const response = await request(app)
      .put(entrypoints.songs + '/1/genres')
      .set('access_token', user_access_token)
      .send(testData)
    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBeDefined();

  });

  it('should fail to update a song\'s genres with no access token', async () => {

    const testData = {
      genres: [
        { id: 3 },
        { id: 2 }
      ]
    };

    const response = await request(app)
      .put(entrypoints.songs + '/1/genres')
      .send(testData)
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBeDefined();

  });

  it('should fail to update a song\'s genres with an invalid access token', async () => {

    const testData = {
      genres: [
        { id: 3 },
        { id: 2 }
      ]
    };

    const response = await request(app)
      .put(entrypoints.songs + '/1/genres')
      .set('access_token', 'adghasvjhvjhasvqn')
      .send(testData)
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBeDefined();

  });

  it('should successfully update a song\'s genres', async () => {

    const testData = {
      genres: [
        { id: 3 },
        { id: 2 }
      ]
    };

    const response = await request(app)
      .put(entrypoints.songs + '/1/genres')
      .set('access_token', admin_access_token)
      .send(testData)
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBeDefined();
    
    const fetchResponse = await request(app)
      .get(entrypoints.songs + '/1');
    const { genres } = fetchResponse.body;
    expect(genres).toEqual([
      {
        id: 3, 
        name: 'VOCALOID'
      },
      {
        id: 2,
        name: 'Rock'
      }
    ]);

  });

  it('should successfully update a song\'s genres with a staff access token', async () => {
    
    const testData = {
      genres: [
        { id: 3 },
        { id: 2 }
      ]
    };

    const response = await request(app)
      .put(entrypoints.songs + '/2/genres')
      .set('access_token', staff_access_token)
      .send(testData)
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBeDefined();
    
    const fetchResponse = await request(app)
      .get(entrypoints.songs + '/2');
    const { genres } = fetchResponse.body;
    expect(genres).toEqual([
      {
        id: 3, 
        name: 'VOCALOID'
      },
      {
        id: 2,
        name: 'Rock'
      }
    ]);

  });

  it('should fail to update a song\'s genres if no data is sent', async () => {

    const testData = {};

    const response = await request(app)
      .put(entrypoints.songs + '/3/genres')
      .set('access_token', admin_access_token)
      .send(testData)
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBeDefined();

  });

  it('should fail to update a song\'s genres if the given JSON is invalid (has no genre id)', async () => {

    const testData = {
      genres: [
        { name: 'Rock' },
        { name: 'VOCALOID' }
      ]
    };

    const response = await request(app)
      .put(entrypoints.songs + '/3/genres')
      .set('access_token', admin_access_token)
      .send(testData)
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBeDefined();

  });

  it('should fail to update a song\'s genres if the given JSON is invalid (has no genre id)', async () => {

    const testData = {
      genres: [
        { id: null },
        { id: 3 }
      ]
    };

    const response = await request(app)
      .put(entrypoints.songs + '/3/genres')
      .set('access_token', admin_access_token)
      .send(testData)
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBeDefined();

  });

  it('should fail to update a song\'s genres if the given JSON is invalid (has no genre id)', async () => {

    const testData = {
      genres: [
        'Rock',
        'VOCALOID'
      ]
    };

    const response = await request(app)
      .put(entrypoints.songs + '/3/genres')
      .set('access_token', admin_access_token)
      .send(testData)
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBeDefined();

  });

  it('should fail to update a song\'s genres if the song has an invalid id', async () => {

    const testData = {
      genres: [
        { id: 3 },
        { id: 2 }
      ]
    };

    const response = await request(app)
      .put(entrypoints.songs + '/nan/genres')
      .set('access_token', admin_access_token)
      .send(testData)
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBeDefined();

  });

  it('should fail to update a song\'s genres if the song is non-existent', async () => {

    const testData = {
      genres: [
        { id: 3 },
        { id: 2 }
      ]
    };

    const response = await request(app)
      .put(entrypoints.songs + '/100/genres')
      .set('access_token', admin_access_token)
      .send(testData)
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBeDefined();

  });

  it('should fail to update a song\'s genres if the genre cannot be found', async () => {

    const testData = {
      genres: [
        { id: 5 }
      ]
    };

    const response = await request(app)
      .put(entrypoints.songs + '/3/genres')
      .set('access_token', admin_access_token)
      .send(testData)
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBeDefined();

  });

});