const request = require('supertest');
const app = require('../app');
const { encrypt } = require('../helpers/encrypt'); 
const { sequelize, SongArtist, ArtistLink } = require('../models');
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
  }
];


/* 
 * END SEED DATA
 */
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
  ['Users', 'Artists', 'ArtistLinks', 'Songs', 'SongArtists'].forEach(async (tableName) => {
    await sequelize.queryInterface.bulkDelete(tableName, null, {
      restartIdentity: true,
      cascade: true,
      truncate: true
    });
  });
});

describe('POST artists', () => {

  it('should successfully add a musical artist', async () => {

    const testData = {
      name: 'Kagamine Rin',
      aliases: ['Rin Kagamine', 'CV-02'],
      imageURL: 'https://image-url.net/1234',
      description: 'Japanese VOCALOID bank.',
      links: [
        {
          webURL: 'https://en.wikipedia.org/wiki/Kagamine_Rin/Len',
          description: 'Wikipedia (JP)'
        },
        {
          webURL: 'https://www.youtube.com/watch?v=abhbaac12f',
          description: 'VEVO Account',
          isInactive: true
        }
      ]
    };

    const response = await request(app)
      .post(entrypoints.artists)
      .set('access_token', admin_access_token)
      .send(testData)
    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBeDefined();

    const fetchResponse = await request(app)
      .get(entrypoints.artists + '/2');
    const { name, aliases, imageURL, description, links } = fetchResponse.body;
    expect(name).toBe(testData.name);
    expect(aliases).toEqual(testData.aliases);
    expect(imageURL).toBe(testData.imageURL);
    expect(description).toBe(testData.description);
    expect(links).toEqual([
      {
        id: 3,
        webURL: 'https://en.wikipedia.org/wiki/Kagamine_Rin/Len',
        description: 'Wikipedia (JP)',
        isInactive: false
      },
      {
        id: 4,
        webURL: 'https://www.youtube.com/watch?v=abhbaac12f',
        description: 'VEVO Account',
        isInactive: true
      }
    ]);

  });

  it('should successfully add a musical artist with a staff access token', async () => {

    const testData = {
      name: 'Kagamine Len',
      aliases: ['Len Kagamine', 'CV-02'],
      imageURL: 'https://image-url.net/5678',
      description: 'Japanese VOCALOID bank.',
      links: [
        {
          webURL: 'https://en.wikipedia.org/wiki/Kagamine_Rin/Len',
          description: 'Wikipedia (JP)'
        },
        {
          webURL: 'https://www.youtube.com/watch?v=abhbaac12f',
          description: 'VEVO Account',
          isInactive: true
        }
      ]
    };

    const response = await request(app)
      .post(entrypoints.artists)
      .set('access_token', staff_access_token)
      .send(testData)
    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBeDefined();

    const fetchResponse = await request(app)
      .get(entrypoints.artists + '/3');
    const { name, aliases, imageURL, description, links } = fetchResponse.body;
    expect(name).toBe(testData.name);
    expect(aliases).toEqual(testData.aliases);
    expect(imageURL).toBe(testData.imageURL);
    expect(description).toBe(testData.description);
    expect(links).toEqual([
      {
        id: 5,
        webURL: 'https://en.wikipedia.org/wiki/Kagamine_Rin/Len',
        description: 'Wikipedia (JP)',
        isInactive: false
      },
      {
        id: 6,
        webURL: 'https://www.youtube.com/watch?v=abhbaac12f',
        description: 'VEVO Account',
        isInactive: true
      }
    ]);

  });

  it('should successfully add a musical artist without all non-optional fields set by the user', async () => {

    const response = await request(app)
      .post(entrypoints.artists)
      .set('access_token', admin_access_token)
      .send({
        name: 'Big Al'
      })
    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBeDefined();

    const fetchResponse = await request(app)
      .get(entrypoints.artists + '/4');
    const { name, aliases, imageURL, description, links } = fetchResponse.body;
    expect(name).toBe('Big Al');
    expect(aliases).toBeNull();
    expect(imageURL).toBeNull();
    expect(description).toBeNull();
    expect(links).toEqual([]);

  });

  it('should successfully add a musical artist with all non-optional fields being empty', async () => {

    const testData = {
      name: 'VY-01',
      aliases: [],
      imageURL: '',
      description: '',
      links: []
    };

    const response = await request(app)
      .post(entrypoints.artists)
      .set('access_token', admin_access_token)
      .send(testData)
    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBeDefined();

    const fetchResponse = await request(app)
      .get(entrypoints.artists + '/5');
    const { name, aliases, imageURL, description, links } = fetchResponse.body;
    expect(name).toBe('VY-01');
    expect(aliases).toBeNull();
    expect(imageURL).toBeNull();
    expect(description).toBe('');
    expect(links).toEqual([]);

  });

  it('should fail to add a musical artist with a user access token', async () => {
    const testData = {
      name: 'VY-02',
      aliases: [],
      imageURL: '',
      description: '',
      links: []
    };
    const response = await request(app)
      .post(entrypoints.artists)
      .set('access_token', user_access_token)
      .send(testData)
    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBeDefined();
  });

  it('should fail to add a musical artist with no access token', async () => {
    const testData = {
      name: 'VY-02',
      aliases: [],
      imageURL: '',
      description: '',
      links: []
    };
    const response = await request(app)
      .post(entrypoints.artists)
      .send(testData)
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBeDefined();
  });

  it('should fail to add a musical artist with an invalid access token', async () => {
    const testData = {
      name: 'VY-02',
      aliases: [],
      imageURL: '',
      description: '',
      links: []
    };
    const response = await request(app)
      .post(entrypoints.artists)
      .set('access_token', 'ascjvjvjhavjhwbqjhb')
      .send(testData)
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBeDefined();
  });

  it('should fail to add a musical artist with no name', async () => {
    const testData = {
      name: ''
    };
    const response = await request(app)
      .post(entrypoints.artists)
      .set('access_token', admin_access_token)
      .send(testData)
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBeDefined();
    expect(response.body.message).toBe('Artist name is required');
  });

  it('should fail to add a musical artist with no data', async () => {
    const response = await request(app)
      .post(entrypoints.artists)
      .set('access_token', admin_access_token)
      .send({})
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBeDefined();
    expect(response.body.message).toBe('Artist name is required');
  });

  it('should fail to add a musical artist if one of the artist links is an invalid URL', async () => {
    const testData = {
      name: 'KAITO',
      links: [
        {
          webURL: 'abavajhjsvjcha',
          description: 'Wikipedia (JP)'
        },
        {
          webURL: 'https://www.youtube.com/watch?v=adagsbc12f',
          description: 'VEVO Account',
          isInactive: true
        }
      ]
    };
    const response = await request(app)
      .post(entrypoints.artists)
      .set('access_token', admin_access_token)
      .send(testData)
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBeDefined();
    expect(response.body.message).toBe('Web URL is not valid');
  });

  it('should fail to add a musical artist if one of the artist links is empty', async () => {
    const testData = {
      name: 'KAITO',
      links: [
        {
          webURL: '',
          description: 'Wikipedia (JP)'
        },
        {
          webURL: 'https://www.youtube.com/watch?v=adagsbc12f',
          description: 'VEVO Account',
          isInactive: true
        }
      ]
    };
    const response = await request(app)
      .post(entrypoints.artists)
      .set('access_token', admin_access_token)
      .send(testData)
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBeDefined();
    expect(response.body.message).toBe('Web URL is required');
  });

  it('should fail to add a musical artist if one of the artist link descriptions is empty', async () => {
    const testData = {
      name: 'KAITO',
      links: [
        {
          webURL: 'http://wikipedia.net',
          description: ''
        },
        {
          webURL: 'https://www.youtube.com/watch?v=adagsbc12f',
          description: 'VEVO Account',
          isInactive: true
        }
      ]
    };
    const response = await request(app)
      .post(entrypoints.artists)
      .set('access_token', admin_access_token)
      .send(testData)
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBeDefined();
    expect(response.body.message).toBe('Description is required');
  });

});

describe('PUT artists', () => {

  it('should successfully update a musical artist', async () => {

    const testData = {
      id: 2,
      name: 'Kagamine Rin',
      aliases: [],
      imageURL: 'https://image-url.net/abcd',
      description: 'Japanese female VOCALOID bank. Released in December 2007.',
      links: [
        {
          id: 3,
          webURL: 'https://en.wikipedia.org/wiki/Kagamine_Rin/Len',
          description: 'Wikipedia (JP)',
          isInactive: false
        },
        {
          id: 4,
          webURL: 'https://www.youtube.com/watch?v=abhbaac12f',
          description: 'VEVO Account',
          isInactive: true
        }
      ]
    };

    const response = await request(app)
      .put(entrypoints.artists + '/2')
      .set('access_token', admin_access_token)
      .send(testData)
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBeDefined();

    const fetchResponse = await request(app)
      .get(entrypoints.artists + '/2');
    const { name, aliases, imageURL, description, links } = fetchResponse.body;
    expect(name).toBe(testData.name);
    expect(aliases).toBeNull();
    expect(imageURL).toBe(testData.imageURL);
    expect(description).toBe(testData.description);
    expect(links).toEqual([
      {
        id: 3,
        webURL: 'https://en.wikipedia.org/wiki/Kagamine_Rin/Len',
        description: 'Wikipedia (JP)',
        isInactive: false
      },
      {
        id: 4,
        webURL: 'https://www.youtube.com/watch?v=abhbaac12f',
        description: 'VEVO Account',
        isInactive: true
      }
    ]);

  });

  it('should successfully update a musical artist with a staff access token', async () => {

    const testData = {
      id: 3,
      name: 'Kagamine Len',
      aliases: [],
      imageURL: 'https://image-url.net/efgh',
      description: 'Japanese male VOCALOID bank. Released in December 2007.',
      links: [
        {
          id: 5,
          webURL: 'https://en.wikipedia.org/wiki/Kagamine_Rin/Len',
          description: 'Wikipedia (JP)',
          isInactive: false
        },
        {
          id: 6,
          webURL: 'https://www.youtube.com/watch?v=abhbaac12f',
          description: 'VEVO Account',
          isInactive: true
        }
      ]
    };

    const response = await request(app)
      .put(entrypoints.artists + '/3')
      .set('access_token', staff_access_token)
      .send(testData)
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBeDefined();

    const fetchResponse = await request(app)
      .get(entrypoints.artists + '/3');
    const { name, aliases, imageURL, description, links } = fetchResponse.body;
    expect(name).toBe(testData.name);
    expect(aliases).toBeNull();
    expect(imageURL).toBe(testData.imageURL);
    expect(description).toBe(testData.description);
    expect(links).toEqual([
      {
        id: 5,
        webURL: 'https://en.wikipedia.org/wiki/Kagamine_Rin/Len',
        description: 'Wikipedia (JP)',
        isInactive: false
      },
      {
        id: 6,
        webURL: 'https://www.youtube.com/watch?v=abhbaac12f',
        description: 'VEVO Account',
        isInactive: true
      }
    ]);

  });

  it('should fail to update a musical artist with a user access token', async () => {
    const testData = {
      id: 1,
      name: 'VY-02',
      aliases: [],
      imageURL: '',
      description: '',
      links: []
    };
    const response = await request(app)
      .put(entrypoints.artists + '/1')
      .set('access_token', user_access_token)
      .send(testData)
    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBeDefined();
  });

  it('should fail to update a musical artist with no access token', async () => {
    const testData = {
      id: 1,
      name: 'VY-02',
      aliases: [],
      imageURL: '',
      description: '',
      links: []
    };
    const response = await request(app)
      .put(entrypoints.artists + '/1')
      .send(testData)
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBeDefined();
  });

  it('should fail to update a musical artist with an invalid access token', async () => {
    const testData = {
      id: 1,
      name: 'VY-02',
      aliases: [],
      imageURL: '',
      description: '',
      links: []
    };
    const response = await request(app)
      .put(entrypoints.artists + '/1')
      .set('access_token', 'ascjvjvjhavjhwbqjhb')
      .send(testData)
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBeDefined();
  });

  it('should fail to update a musical artist with no name', async () => {
    const testData = {
      name: ''
    };
    const response = await request(app)
      .put(entrypoints.artists + '/1')
      .set('access_token', admin_access_token)
      .send(testData)
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBeDefined();
    expect(response.body.message).toBe('Artist name is required');
  });

  it('should fail to update a musical artist with no data', async () => {
    const response = await request(app)
      .put(entrypoints.artists + '/1')
      .set('access_token', admin_access_token)
      .send({})
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBeDefined();
    expect(response.body.message).toBe('Artist name is required');
  });

  it('should successfully update a musical artist\'s nested resources', async () => {

    const testData = {
      id: 2,
      name: 'Kagamine Rin',
      aliases: [],
      imageURL: 'https://image-url.net/abcd',
      description: 'Japanese female VOCALOID bank. Released in December 2007.',
      links: [
        {
          id: 4,
          webURL: 'https://www.youtube.com/watch?v=bbajjcakmw',
          description: 'VEVO Account',
          isInactive: true
        },
        {
          webURL: 'https://vocadb.net',
          description: 'VOCALOID database',
          isInactive: false
        },
      ]
    };

    const response = await request(app)
      .put(entrypoints.artists + '/2')
      .set('access_token', admin_access_token)
      .send(testData)
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBeDefined();

    const fetchResponse = await request(app)
      .get(entrypoints.artists + '/2');
    const { name, aliases, imageURL, description, links } = fetchResponse.body;
    expect(name).toBe(testData.name);
    expect(aliases).toBeNull();
    expect(imageURL).toBe(testData.imageURL);
    expect(description).toBe(testData.description);
    expect(links).toEqual([
      {
        id: 4,
        webURL: 'https://www.youtube.com/watch?v=bbajjcakmw',
        description: 'VEVO Account',
        isInactive: true
      },
      {
        id: 7,
        webURL: 'https://vocadb.net',
        description: 'VOCALOID database',
        isInactive: false
      }
    ]);

  });

  it('should fail to update a musical artist\'s nested resources if failed validation checks', async () => {

    const testData = {
      id: 3,
      name: 'Kagamine Len',
      aliases: [],
      imageURL: 'https://image-url.net/efgh',
      description: 'Japanese male VOCALOID bank. Released in December 2007.',
      links: [
        {
          id: 5,
          webURL: '',
          description: 'Wikipedia (JP)',
          isInactive: false
        },
        {
          id: 6,
          webURL: 'https://www.youtube.com/watch?v=abhbaac12f',
          description: 'VEVO Account',
          isInactive: true
        }
      ]
    };

    const response = await request(app)
      .put(entrypoints.artists + '/3')
      .set('access_token', admin_access_token)
      .send(testData)
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBeDefined();

  });

});

describe('DELETE artists', () => {

  it('should fail to delete a musical artist with a staff access token', async () => {
    const response = await request(app)
      .delete(entrypoints.artists + '/1')
      .set('access_token', staff_access_token);
    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBeDefined();
  });

  it('should fail to delete a musical artist with a user access token', async () => {
    const response = await request(app)
      .delete(entrypoints.artists + '/1')
      .set('access_token', user_access_token);
    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBeDefined();
  });

  it('should fail to delete a musical artist with no access token', async () => {
    const response = await request(app)
      .delete(entrypoints.artists + '/1');
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBeDefined();
  });

  it('should fail to delete a musical artist with an invalid access token', async () => {
    const response = await request(app)
      .delete(entrypoints.artists + '/1')
      .set('access_token', 'ascjvjvjhavjhwbqjhb');
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBeDefined();
  });

  it('should successfully delete a musical artist, including sub-resources', async () => {

    const response = await request(app)
      .delete(entrypoints.artists + '/1')
      .set('access_token', admin_access_token);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBeDefined();

    const fetchResponse = await request(app)
      .get(entrypoints.artists + '/1');
    expect(fetchResponse.statusCode).toBe(404);

    const checkArtistLink = await ArtistLink.findOne({ 
      attributes: ['id'],
      where: {ArtistId: 1} 
    });
    expect(checkArtistLink).toBeFalsy();

    const checkSongArtist = await SongArtist.findOne({  
      attributes: ['id'],
      where: {ArtistId: 1} 
    });
    expect(checkSongArtist).toBeFalsy();

  });

  it('should fail to delete a musical artist with an invalid id', async () => {
    const response = await request(app)
      .delete(entrypoints.artists + '/nan')
      .set('access_token', admin_access_token);
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBeDefined();
  });

  it('should fail to delete a musical artist with a non-existent id', async () => {
    const response = await request(app)
      .delete(entrypoints.artists + '/100')
      .set('access_token', admin_access_token);
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBeDefined();
  });

});