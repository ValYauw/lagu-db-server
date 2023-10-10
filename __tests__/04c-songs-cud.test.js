const request = require('supertest');
const app = require('../app');
const { encrypt } = require('../helpers/encrypt'); 
const { sequelize, SongArtist, PlayLink, SongGenre } = require('../models');
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

describe('POST songs', () => {

  it('should successfully add an original song', async () => {

    const testData = {
      name: "ドラマツルギー", 
      aliases: ["Dramaturgy"], 
      releaseDate: "2017-10-11T00:00:00", 
      songType: 'Original', 
      parentId: null, 
      artists: [{
        id: 2,
        role: 'composer, singer'
      }], 
      links: [{
        songURL: "https://www.youtube.com/watch?v=jJzw1h5CR-I",
        isInactive: false
      }]
    };

    const response = await request(app)
      .post(entrypoints.songs)
      .set('access_token', admin_access_token)
      .send(testData)
    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBeDefined(); 

    const fetchResponse = await request(app)
      .get(entrypoints.songs + '/5');
    const { 
      name, aliases, releaseDate, songType, 
      basedOn, derivatives, genres, artists, links, timedLyrics 
    } = fetchResponse.body;
    expect(name).toBe(testData.name);
    expect(aliases).toEqual(testData.aliases);
    const compareDate = new Date(releaseDate);
    expect(compareDate.getFullYear()).toBe(2017);
    expect(compareDate.getMonth()).toBe(9);
    expect(compareDate.getDate()).toBe(11);
    expect(songType).toBe('Original');
    expect(basedOn).toBeNull();
    expect(derivatives).toEqual([]);
    expect(genres).toEqual([]);
    expect(artists).toEqual([
      {
        id: 2,
        name: 'Eve',
        aliases: null,
        role: 'composer, singer'
      }
    ]);
    expect(links).toEqual([
      {
        id: 8,
        songURL: "https://www.youtube.com/watch?v=jJzw1h5CR-I",
        isInactive: false
      }
    ]);
    expect(timedLyrics).toBeNull();

  });

  it('should successfully add an original song with a staff access token', async () => {

    const testData = {
      name: "ナンセンス文学", 
      aliases: ["Nonsense Bungaku", "Literary Nonsense"], 
      releaseDate: "2017-05-20T00:00:00", 
      songType: 'Original', 
      parentId: null, 
      artists: [{
        id: 2,
        role: 'composer, singer'
      }], 
      links: [{
        songURL: "https://www.youtube.com/watch?v=OskXF3s0UT8",
        isInactive: false
      }]
    };

    const response = await request(app)
      .post(entrypoints.songs)
      .set('access_token', staff_access_token)
      .send(testData)
    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBeDefined(); 

    const fetchResponse = await request(app)
      .get(entrypoints.songs + '/6');
    const { 
      name, aliases, releaseDate, songType, 
      basedOn, derivatives, genres, artists, links, timedLyrics 
    } = fetchResponse.body;
    expect(name).toBe(testData.name);
    expect(aliases).toEqual(testData.aliases);
    const compareDate = new Date(releaseDate);
    expect(compareDate.getFullYear()).toBe(2017);
    expect(compareDate.getMonth()).toBe(4);
    expect(compareDate.getDate()).toBe(20);
    expect(songType).toBe('Original');
    expect(basedOn).toBeNull();
    expect(derivatives).toEqual([]);
    expect(genres).toEqual([]);
    expect(artists).toEqual([
      {
        id: 2,
        name: 'Eve',
        aliases: null,
        role: 'composer, singer'
      }
    ]);
    expect(links).toEqual([
      {
        id: 9,
        songURL: "https://www.youtube.com/watch?v=OskXF3s0UT8",
        isInactive: false
      }
    ]);
    expect(timedLyrics).toBeNull();

  });

  it('should successfully add a derivative song', async () => {

    const testData = {
      name: "アンハッピーリフレイン", 
      aliases: ["Unhappy Refrain"], 
      releaseDate: "2017-10-11T00:00:00", 
      songType: 'Cover', 
      parentId: 3, 
      artists: [{
        id: 2,
        role: 'composer, singer'
      }], 
      links: [{
        songURL: "https://www.youtube.com/watch?v=aafav12af",
        isInactive: false
      }]
    };

    const response = await request(app)
      .post(entrypoints.songs)
      .set('access_token', admin_access_token)
      .send(testData)
    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBeDefined(); 

    const fetchResponse = await request(app)
      .get(entrypoints.songs + '/7');
    const { 
      name, aliases, releaseDate, songType, 
      basedOn, derivatives, genres, artists, links, timedLyrics 
    } = fetchResponse.body;
    expect(name).toBe(testData.name);
    expect(aliases).toEqual(testData.aliases);
    const compareDate = new Date(releaseDate);
    expect(compareDate.getFullYear()).toBe(2017);
    expect(compareDate.getMonth()).toBe(9);
    expect(compareDate.getDate()).toBe(11);
    expect(songType).toBe('Cover');
    expect(basedOn).toEqual({
      id: 3,
      name: "アンハッピーリフレイン", 
      aliases: ["Unhappy Refrain"], 
      releaseDate: new Date("2011-05-02T00:00:00").toISOString(),
      songType: 'Original'
    });
    expect(derivatives).toEqual([]);
    expect(genres).toEqual([]);
    expect(artists).toEqual([
      {
        id: 2,
        name: 'Eve',
        aliases: null,
        role: 'composer, singer'
      }
    ]);
    expect(links).toEqual([
      {
        id: 10,
        songURL: "https://www.youtube.com/watch?v=aafav12af",
        isInactive: false
      }
    ]);
    expect(timedLyrics).toBeNull();

  });

  it('should successfully add a song without all non-optional fields set by the user', async () => {

    const testData = {
      name: "phony"
    };

    const response = await request(app)
      .post(entrypoints.songs)
      .set('access_token', admin_access_token)
      .send(testData)
    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBeDefined();

    const fetchResponse = await request(app)
      .get(entrypoints.songs + '/8');
    const { 
      name, aliases, releaseDate, songType, 
      basedOn, derivatives, genres, artists, links, timedLyrics 
    } = fetchResponse.body;
    expect(name).toBe(testData.name);
    expect(aliases).toBeNull();
    expect(releaseDate).toBeNull();
    expect(songType).toBe('Original');
    expect(basedOn).toBeNull();
    expect(derivatives).toEqual([]);
    expect(genres).toEqual([]);
    expect(artists).toEqual([]);
    expect(links).toEqual([]);
    expect(timedLyrics).toBeNull();

  });

  it('should successfully add a song with all non-optional fields being empty', async () => {

    const testData = {
      name: "phony",
      aliases: [], 
      releaseDate: '', 
      songType: '', 
      parentId: '', 
      artists: [], 
      links: []
    };

    const response = await request(app)
      .post(entrypoints.songs)
      .set('access_token', admin_access_token)
      .send(testData)
    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBeDefined();

    const fetchResponse = await request(app)
      .get(entrypoints.songs + '/9');
    const { 
      name, aliases, releaseDate, songType, 
      basedOn, derivatives, genres, artists, links, timedLyrics 
    } = fetchResponse.body;
    expect(name).toBe(testData.name);
    expect(aliases).toBeNull();
    expect(releaseDate).toBeNull();
    expect(songType).toBe('Original');
    expect(basedOn).toBeNull();
    expect(derivatives).toEqual([]);
    expect(genres).toEqual([]);
    expect(artists).toEqual([]);
    expect(links).toEqual([]);
    expect(timedLyrics).toBeNull();

  });

  it('should fail to add a song with a user access token', async () => {
    const testData = {
      name: "phony",
      aliases: [], 
      releaseDate: '2020-11-04T00:00:00', 
      songType: 'Original', 
      parentId: null, 
      artists: [], 
      links: []
    };
    const response = await request(app)
      .post(entrypoints.songs)
      .set('access_token', user_access_token)
      .send(testData)
    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBeDefined();
  });

  it('should fail to add a song with no access token', async () => {
    const testData = {
      name: "phony",
      aliases: [], 
      releaseDate: '2020-11-04T00:00:00', 
      songType: 'Original', 
      parentId: null, 
      artists: [], 
      links: []
    };
    const response = await request(app)
      .post(entrypoints.songs)
      .send(testData)
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBeDefined();
  });

  it('should fail to add a song with an invalid access token', async () => {
    const testData = {
      name: "phony",
      aliases: [], 
      releaseDate: '2020-11-04T00:00:00', 
      songType: 'Original', 
      parentId: null, 
      artists: [], 
      links: []
    };
    const response = await request(app)
      .post(entrypoints.songs)
      .set('access_token', 'ascjvjvjhavjhwbqjhb')
      .send(testData)
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBeDefined();
  });

  it('should fail to add a song with no name', async () => {
    const testData = {
      name: "",
      aliases: [], 
      releaseDate: '2020-11-04T00:00:00', 
      songType: 'Original', 
      parentId: null, 
      artists: [], 
      links: []
    };
    const response = await request(app)
      .post(entrypoints.songs)
      .set('access_token', admin_access_token)
      .send(testData)
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBeDefined();
    expect(response.body.message).toBe('Song name is required');
  });

  it('should fail to add a song with no data', async () => {
    const response = await request(app)
      .post(entrypoints.songs)
      .set('access_token', admin_access_token)
      .send({})
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBeDefined();
    expect(response.body.message).toBe('Song name is required');
  });

  it('should fail to add a song if one of the links is an invalid URL', async () => {
    const testData = {
      name: "phony",
      aliases: [], 
      releaseDate: '2020-11-04T00:00:00', 
      songType: 'Original', 
      parentId: null, 
      artists: [], 
      links: [{
        songURL: "image-url",
        isInactive: false
      }]
    };
    const response = await request(app)
      .post(entrypoints.songs)
      .set('access_token', admin_access_token)
      .send(testData)
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBeDefined();
    expect(response.body.message).toBe('Song URL is not valid');
  });

  it('should fail to add a song if one of the links is empty', async () => {
    const testData = {
      name: "phony",
      aliases: [], 
      releaseDate: '2020-11-04T00:00:00', 
      songType: 'Original', 
      parentId: null, 
      artists: [], 
      links: [{
        songURL: "",
        isInactive: false
      }]
    };
    const response = await request(app)
      .post(entrypoints.songs)
      .set('access_token', admin_access_token)
      .send(testData)
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBeDefined();
    expect(response.body.message).toBe('Song URL is required');
  });

});

describe('PUT songs', () => {

  it('should successfully update a song', async () => {

    const testData = {
      id: 2,
      name: "Ura Omote Lovers", 
      aliases: ["裏表ラバーズ"], 
      releaseDate: "2009-08-26T00:00:00", 
      songType: 'Cover', 
      parentId: 1, 
      artists: [{
        id: 1,
        role: 'vocalist',
      }], 
      links: [
        {
          id: 3,
          songURL: "https://www.nicovideo.jp/watch/sm8082467",
          isInactive: false
        },
        {
          id: 4,
          songURL: "https://www.youtube.com/watch?v=b_cuMcDWwsI",
          isInactive: false
        },
        {
          id: 5,
          songURL: "https://piapro.jp/t/NXYR",
          isInactive: false
        }
      ]
    };

    const response = await request(app)
      .put(entrypoints.songs + '/2')
      .set('access_token', admin_access_token)
      .send(testData)
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBeDefined();

    const fetchResponse = await request(app)
      .get(entrypoints.songs + '/2');
    const { 
      name, aliases, releaseDate, songType, 
      basedOn, derivatives, genres, artists, links, timedLyrics 
    } = fetchResponse.body;
    expect(name).toBe(testData.name);
    expect(aliases).toEqual(testData.aliases);
    const compareDate = new Date(releaseDate);
    expect(compareDate.getFullYear()).toBe(2009);
    expect(compareDate.getMonth()).toBe(7);
    expect(compareDate.getDate()).toBe(26);
    expect(songType).toBe('Cover');
    expect(basedOn).not.toBeNull();
    expect(basedOn.id).toBe(1);
    expect(derivatives).toEqual([]);
    expect(genres).toEqual([
      { id: 1, name: "Pop" },
      { id: 3, name: "VOCALOID" }
    ]);
    expect(artists).toEqual([
      {
        id: 1,
        name: 'Hatsune Miku',
        aliases: ['Miku Hatsune', 'CV-01'],
        role: 'vocalist'
      }
    ]);
    expect(links).toEqual([
      {
        id: 3,
        songURL: "https://www.nicovideo.jp/watch/sm8082467",
        isInactive: false
      },
      {
        id: 4,
        songURL: "https://www.youtube.com/watch?v=b_cuMcDWwsI",
        isInactive: false
      },
      {
        id: 5,
        songURL: "https://piapro.jp/t/NXYR",
        isInactive: false
      }
    ]);
    expect(timedLyrics).toBeNull();

  });

  it('should successfully update a song', async () => {

    const testData = {
      id: 2,
      name: "Two-faced Lovers", 
      aliases: [], 
      releaseDate: "2009-08-26T00:00:00", 
      songType: 'Original', 
      parentId: null, 
      artists: [{
        id: 1,
        role: 'vocalist',
      }], 
      links: [
        {
          id: 3,
          songURL: "https://www.nicovideo.jp/watch/sm8082467",
          isInactive: false
        },
        {
          id: 4,
          songURL: "https://www.youtube.com/watch?v=b_cuMcDWwsI",
          isInactive: false
        },
        {
          id: 5,
          songURL: "https://piapro.jp/t/NXYR",
          isInactive: false
        }
      ]
    };

    const response = await request(app)
      .put(entrypoints.songs + '/2')
      .set('access_token', admin_access_token)
      .send(testData)
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBeDefined();

    const fetchResponse = await request(app)
      .get(entrypoints.songs + '/2');
    const { 
      name, aliases, releaseDate, songType, 
      basedOn, derivatives, genres, artists, links, timedLyrics 
    } = fetchResponse.body;
    expect(name).toBe(testData.name);
    expect(aliases).toBeNull();
    const compareDate = new Date(releaseDate);
    expect(compareDate.getFullYear()).toBe(2009);
    expect(compareDate.getMonth()).toBe(7);
    expect(compareDate.getDate()).toBe(26);
    expect(songType).toBe('Original');
    expect(basedOn).toBeNull();
    expect(derivatives).toEqual([]);
    expect(genres).toEqual([
      { id: 1, name: "Pop" },
      { id: 3, name: "VOCALOID" }
    ]);
    expect(artists).toEqual([
      {
        id: 1,
        name: 'Hatsune Miku',
        aliases: ['Miku Hatsune', 'CV-01'],
        role: 'vocalist'
      }
    ]);
    expect(links).toEqual([
      {
        id: 3,
        songURL: "https://www.nicovideo.jp/watch/sm8082467",
        isInactive: false
      },
      {
        id: 4,
        songURL: "https://www.youtube.com/watch?v=b_cuMcDWwsI",
        isInactive: false
      },
      {
        id: 5,
        songURL: "https://piapro.jp/t/NXYR",
        isInactive: false
      }
    ]);
    expect(timedLyrics).toBeNull();

  });

  it('should fail to update a song with a user access token', async () => {
    const testData = {
      id: 1,
      name: "Rolling Girl", 
      aliases: [], 
      releaseDate: null, 
      songType: 'Original', 
      parentId: null, 
      artists: [], 
      links: []
    };
    const response = await request(app)
      .put(entrypoints.songs + '/1')
      .set('access_token', user_access_token)
      .send(testData)
    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBeDefined();
  });

  it('should fail to update a song with no access token', async () => {
    const testData = {
      id: 1,
      name: "Rolling Girl", 
      aliases: [], 
      releaseDate: null, 
      songType: 'Original', 
      parentId: null, 
      artists: [], 
      links: []
    };
    const response = await request(app)
      .put(entrypoints.songs + '/1')
      .send(testData)
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBeDefined();
  });

  it('should fail to update a song with an invalid access token', async () => {
    const testData = {
      id: 1,
      name: "Rolling Girl", 
      aliases: [], 
      releaseDate: null, 
      songType: 'Original', 
      parentId: null, 
      artists: [], 
      links: []
    };
    const response = await request(app)
      .put(entrypoints.songs + '/1')
      .set('access_token', 'ascjvjvjhavjhwbqjhb')
      .send(testData)
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBeDefined();
  });

  it('should fail to update a song with no name', async () => {
    const testData = {
      id: 1,
      name: "", 
      aliases: [], 
      releaseDate: null, 
      songType: 'Original', 
      parentId: null, 
      artists: [], 
      links: []
    };
    const response = await request(app)
      .put(entrypoints.songs + '/1')
      .set('access_token', admin_access_token)
      .send(testData)
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBeDefined();
    expect(response.body.message).toBe('Song name is required');
  });

  it('should fail to update a song with no data', async () => {
    const response = await request(app)
      .put(entrypoints.songs + '/1')
      .set('access_token', admin_access_token)
      .send({})
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBeDefined();
    expect(response.body.message).toBe('Song name is required');
  });

  it('should successfully update a song\'s nested resources', async () => {

    const testData = {
      id: 3,
      name: "アンハッピーリフレイン", 
      aliases: ["Unhappy Refrain"], 
      releaseDate: "2011-05-02T00:00:00", 
      songType: 'Original', 
      parentId: null, 
      artists: [
        {
          id: 1,
          role: 'vocal synth',
        },
        {
          id: 2,
          role: 'producer',
        }
      ], 
      links: [
        {
          id: 7,
          songURL: "https://www.youtube.com/watch?v=uTlv9VWAcso",
          isInactive: false
        },
        {
          songURL: "https://piapro.jp/fg12",
          isInactive: true
        }
      ]
    };

    const response = await request(app)
      .put(entrypoints.songs + '/3')
      .set('access_token', admin_access_token)
      .send(testData)
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBeDefined();

    const fetchResponse = await request(app)
      .get(entrypoints.songs + '/3');
    const { 
      name, aliases, releaseDate, songType, 
      basedOn, derivatives, genres, artists, links, timedLyrics 
    } = fetchResponse.body;
    expect(name).toBe(testData.name);
    expect(aliases).toEqual(testData.aliases);
    const compareDate = new Date(releaseDate);
    expect(compareDate.getFullYear()).toBe(2011);
    expect(compareDate.getMonth()).toBe(4);
    expect(compareDate.getDate()).toBe(2);
    expect(songType).toBe('Original');
    expect(basedOn).toBeNull();
    expect(derivatives).toBeDefined();
    expect(genres).toEqual([
      { id: 1, name: "Pop" },
      { id: 3, name: "VOCALOID" }
    ]);
    expect(artists).toEqual([
      {
        id: 1,
        name: 'Hatsune Miku',
        aliases: ['Miku Hatsune', 'CV-01'],
        role: 'vocal synth'
      },
      {
        id: 2,
        name: 'Eve',
        aliases: null,
        role: 'producer'
      }
    ]);
    expect(links).toEqual([
      {
        id: 7,
        songURL: "https://www.youtube.com/watch?v=uTlv9VWAcso",
        isInactive: false
      },
      {
        id: 11,
        songURL: "https://piapro.jp/fg12",
        isInactive: true
      },
    ]);
    expect(timedLyrics).toBeNull();

  });

  it('should fail to update a song\'s nested resources if failed validation checks', async () => {

    const testData = {
      id: 3,
      name: "アンハッピーリフレイン", 
      aliases: ["Unhappy Refrain"], 
      releaseDate: "2011-05-02T00:00:00", 
      songType: 'Original', 
      parentId: null, 
      artists: [
        {
          id: 1,
          role: 'vocal synth',
        },
        {
          id: 2,
          role: 'producer',
        }
      ], 
      links: [
        {
          id: 7,
          songURL: "https://www.youtube.com/watch?v=uTlv9VWAcso",
          isInactive: false
        },
        {
          id: 11,
          songURL: "https://piapro.jp/fg12",
          isInactive: true
        },
        {
          songURL: "image-url",
          isInactive: false
        },
      ]
    };

    const response = await request(app)
      .put(entrypoints.songs + '/3')
      .set('access_token', admin_access_token)
      .send(testData)
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBeDefined();

  });

});

describe('DELETE songs', () => {

  it('should fail to delete a song with a staff access token', async () => {
    const response = await request(app)
      .delete(entrypoints.songs + '/1')
      .set('access_token', staff_access_token);
    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBeDefined();
  });

  it('should fail to delete a song with a user access token', async () => {
    const response = await request(app)
      .delete(entrypoints.songs + '/1')
      .set('access_token', user_access_token);
    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBeDefined();
  });

  it('should fail to delete a song with no access token', async () => {
    const response = await request(app)
      .delete(entrypoints.songs + '/1');
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBeDefined();
  });

  it('should fail to delete a song with an invalid access token', async () => {
    const response = await request(app)
      .delete(entrypoints.songs + '/1')
      .set('access_token', 'ascjvjvjhavjhwbqjhb');
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBeDefined();
  });

  it('should successfully delete a song, including sub-resources, and without deleting its derivatives', async () => {

    const response = await request(app)
      .delete(entrypoints.songs + '/1')
      .set('access_token', admin_access_token);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBeDefined();

    let fetchResponse = await request(app)
      .get(entrypoints.songs + '/1');
    expect(fetchResponse.statusCode).toBe(404);

    const checkPlayLink = await PlayLink.findOne({ 
      attributes: ['id'],
      where: {SongId: 1} 
    });
    expect(checkPlayLink).toBeFalsy();

    const checkSongArtist = await SongArtist.findOne({  
      attributes: ['id'],
      where: {SongId: 1} 
    });
    expect(checkSongArtist).toBeFalsy();

    const checkSongGenre = await SongGenre.findOne({  
      attributes: ['id'],
      where: {SongId: 1} 
    });
    expect(checkSongGenre).toBeFalsy();

    fetchResponse = await request(app)
      .get(entrypoints.songs + '/4');
    expect(fetchResponse.statusCode).toBe(200);
    const derivative = fetchResponse.body;
    expect(derivative.songType).toBe('Cover');
    expect(derivative.basedOn).toBeNull();

  });

  it('should fail to delete a song with an invalid id', async () => {
    const response = await request(app)
      .delete(entrypoints.songs + '/nan')
      .set('access_token', admin_access_token);
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBeDefined();
  });

  it('should fail to delete a song with a non-existent id', async () => {
    const response = await request(app)
      .delete(entrypoints.songs + '/100')
      .set('access_token', admin_access_token);
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBeDefined();
  });

});