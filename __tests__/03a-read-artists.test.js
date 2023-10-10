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
const artists = [
  {
    name: 'Hatsune Miku',
    aliases: ['Miku Hatsune', 'CV-01'],
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
  {
    name: 'Eve',
    createdAt: dummyDate,
    updatedAt: dummyDate
  }
];
const artistLinks = [
  {
    webURL: "https://en.wikipedia.org/wiki/Hatsune_Miku",
    description: "Wikipedia",
    ArtistId: 1,
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
  {
    webURL: "https://ec.crypton.co.jp/pages/prod/vocaloid/mikuv4x",
    description: "Official webpage (JP)",
    ArtistId: 1,
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
  {
    webURL: "https://eveofficial.com/",
    description: "Official webpage (JP)",
    ArtistId: 2,
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
  {
    webURL: "https://www.youtube.com/channel/UCUXfRsEIJ9xO1DT7TbEWksw",
    description: "YouTube Channel",
    ArtistId: 2,
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
  {
    webURL: "https://www.nicovideo.jp/user/10103681",
    description: "Niconico Channel",
    ArtistId: 2,
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
    name: "ドラマツルギー",
    aliases: ["Dramaturgy"],
    releaseDate: new Date("2017-10-11T00:00:00"),
    songType: "Original",
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
  {
    name: "ナンセンス文学",
    aliases: ["Nonsense Bungaku", "Literary Nonsense"],
    releaseDate: new Date("2017-05-20T00:00:00"),
    songType: "Original",
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
  {
    name: "お気に召すまま",
    aliases: ["Oki ni Mesu mama", "As You Like It"],
    releaseDate: new Date("2017-11-29T00:00:00"),
    songType: "Original",
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
  {
    name: "トーキョーゲットー",
    aliases: ["Tokyo Ghetto"],
    releaseDate: new Date("2018-07-06T00:00:00"),
    songType: "Original",
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
  {
    name: "ラストダンス",
    aliases: ["Last Dance"],
    releaseDate: new Date("2018-12-14T00:00:00"),
    songType: "Original",
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
  {
    name: "アウトサイダー",
    aliases: ["Outsider"],
    releaseDate: new Date("2018-04-07T00:00:00"),
    songType: "Original",
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
    role: 'composer, vocalist',
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
  {
    SongId: 5,
    ArtistId: 2,
    role: 'composer, vocalist',
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
  {
    SongId: 6,
    ArtistId: 2,
    role: 'composer, vocalist',
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
  {
    SongId: 7,
    ArtistId: 2,
    role: 'composer, vocalist',
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
  {
    SongId: 8,
    ArtistId: 2,
    role: 'composer, vocalist',
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
  {
    SongId: 9,
    ArtistId: 2,
    role: 'composer, vocalist',
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
  await sequelize.queryInterface.bulkInsert('Artists', artists);
  await sequelize.queryInterface.bulkInsert('ArtistLinks', artistLinks);
  await sequelize.queryInterface.bulkInsert('Songs', songs);
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
  ['Users', 'Artists', 'ArtistLinks', 'Songs', 'SongArtists'].forEach(async (tableName) => {
    await sequelize.queryInterface.bulkDelete(tableName, null, {
      restartIdentity: true,
      cascade: true,
      truncate: true
    });
  });
});

describe('GET artists', () => {

  it('should get the list of musical artists', async () => {
    const response = await request(app)
      .get(entrypoints.artists)
    expect(response.statusCode).toBe(200);
    const { count, offset, data } = response.body;
    expect(count).toBeDefined();
    expect(offset).toBeDefined();
    expect(data).toBeDefined();
    expect(count).toBe(2);
    expect(data.length).toBe(2);
    const artist = data[0];
    const { name, aliases, imageURL, description, numSongs } = artist;
    expect(name).toBeDefined();
    expect(aliases).toBeDefined();
    expect(imageURL).toBeDefined();
    expect(description).toBeDefined();
    expect(numSongs).toBeDefined();
    expect(name).toBe('Eve');
    expect(aliases).toBeNull();
    expect(imageURL).toBeNull();
    expect(description).toBeNull();
    expect(numSongs).toBe(6);
  });

  it('should get a specific artist', async () => {
    const response = await request(app)
      .get(entrypoints.artists + '/1')
    expect(response.statusCode).toBe(200);
    const data = response.body;
    expect(data).toBeDefined();
    const { name, aliases, imageURL, description, links } = data;
    expect(name).toBeDefined();
    expect(aliases).toBeDefined();
    expect(imageURL).toBeDefined();
    expect(description).toBeDefined();
    expect(links).toBeDefined();
    expect(name).toBe('Hatsune Miku');
    expect(aliases).toEqual(['Miku Hatsune', 'CV-01']);
    expect(imageURL).toBeNull();
    expect(description).toBeNull();
    expect(links).toEqual([
      {
        id: 1,
        isInactive: false,
        webURL: "https://en.wikipedia.org/wiki/Hatsune_Miku",
        description: "Wikipedia",
      },
      {
        id: 2,
        isInactive: false,
        webURL: "https://ec.crypton.co.jp/pages/prod/vocaloid/mikuv4x",
        description: "Official webpage (JP)",
      }
    ]);
  });

});