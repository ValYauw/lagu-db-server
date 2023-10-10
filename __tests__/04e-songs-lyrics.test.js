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
    name: "ローリンガール",
    aliases: ["Rolling Girl"],
    releaseDate: new Date("2010-02-14T00:00:00"),
    songType: "Remix",
    parentId: 1,
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
  await sequelize.queryInterface.bulkInsert('Songs', songs);

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
  ['Users', 'Songs', 'TimedLyrics'].forEach(async (tableName) => {
    await sequelize.queryInterface.bulkDelete(tableName, null, {
      restartIdentity: true,
      cascade: true,
      truncate: true
    });
  });
});

const testData = {
  srt: `1\n00:00:31,982 --> 00:00:41,892\nFor lonely girls, it's always the same, dreaming dreams that don't come true\n\n2\n00:00:41,892 --> 00:00:51,768\nAnd churning, churning through the clamor in their heads\n\n3\n00:00:51,768 --> 00:01:01,478\n( )\n\n4\n00:01:01,478 --> 00:01:11,354\nA lonely girl mutters "I'm fine", have words failed her?\n\n5\n00:01:11,354 --> 00:01:13,623\nA failure, a failure.\n\n6\n00:01:13,623 --> 00:01:21,198\nObsessing over her mistakes makes everything spin again!\n\n7\n00:01:21,198 --> 00:01:21,198\n( )\n\n8\n00:01:21,198 --> 00:01:23,533\nOne more time, one more time\n\n9\n00:01:23,533 --> 00:01:25,936\n“I'll roll along today”\n\n10\n00:01:25,936 --> 00:01:28,405\nThe girl said, the girl said\n\n11\n00:01:28,405 --> 00:01:31,174\nBreathing life into the words!\n\n12\n00:01:31,174 --> 00:01:32,209\n“How about now?”\n\n13\n00:01:32,209 --> 00:01:40,951\n“Not yet, we still can't see what's ahead. Hold your breath, for now.”\n\n14\n00:01:40,951 --> 00:01:50,927\n( )\n\n15\n00:01:50,927 --> 00:02:00,570\nThis is how it ends for a Rolling Girl, unable to reach the colors on the other side\n\n16\n00:02:00,570 --> 00:02:10,413\nThe overlapping voices, they blend together, blend together\n\n17\n00:02:10,413 --> 00:02:20,257\nShe mutters, "I'm fine.", but the words fail her\n\n18\n00:02:20,257 --> 00:02:22,692\nNot caring how it ends\n\n19\n00:02:22,692 --> 00:02:29,900\nAn upward climb that invites mistakes\n\n20\n00:02:29,900 --> 00:02:29,900\n( )\n\n21\n00:02:29,900 --> 00:02:32,435\nOne more time, one more time\n\n22\n00:02:32,435 --> 00:02:35,005\nPlease, get me rolling\n\n23\n00:02:35,005 --> 00:02:37,340\nThe girl said, the girl said\n\n24\n00:02:37,340 --> 00:02:40,043\nWith her intense silence!\n\n25\n00:02:40,043 --> 00:02:41,144\n“How about now?”\n\n26\n00:02:41,144 --> 00:02:49,819\n“Just a little more, We should see something soon. Hold your breath, for now.”\n\n27\n00:02:49,819 --> 00:02:49,819\n( )\n\n28\n00:02:49,819 --> 00:02:52,088\nOne more time, one more time\n\n29\n00:02:52,088 --> 00:02:54,691\n“I'll roll along again today”\n\n30\n00:02:54,691 --> 00:02:57,027\nThe girl said, the girl said\n\n31\n00:02:57,027 --> 00:02:59,663\nBreathing laughter into the words!\n\n32\n00:02:59,663 --> 00:03:04,668\n“How about now? OK, you can look. You must be exhausted too, right?”\n\n33\n00:03:04,668 --> 00:03:09,573\nWe’ll hold our breath, right now.`
};

const expectedParsed = [
  {
    id: 1,
    startTime: 31982,
    endTime: 41892,
    text: "For lonely girls, it's always the same, dreaming dreams that don't come true"
  },
  {
    id: 2,
    startTime: 41892,
    endTime: 51768,
    text: "And churning, churning through the clamor in their heads"
  },
  {
    id: 3,
    startTime: 51768,
    endTime: 61478,
    text: "( )"
  },
  {
    id: 4,
    startTime: 61478,
    endTime: 71354,
    text: "A lonely girl mutters \"I'm fine\", have words failed her?"
  },
  {
    id: 5,
    startTime: 71354,
    endTime: 73623,
    text: "A failure, a failure."
  },
  {
    id: 6,
    startTime: 73623,
    endTime: 81198,
    text: "Obsessing over her mistakes makes everything spin again!"
  },
  {
    id: 7,
    startTime: 81198,
    endTime: 81198,
    text: "( )"
  },
  {
    id: 8,
    startTime: 81198,
    endTime: 83533,
    text: "One more time, one more time"
  },
  {
    id: 9,
    startTime: 83533,
    endTime: 85936,
    text: "“I'll roll along today”"
  },
  {
    id: 10,
    startTime: 85936,
    endTime: 88405,
    text: "The girl said, the girl said"
  },
  {
    id: 11,
    startTime: 88405,
    endTime: 91174,
    text: "Breathing life into the words!"
  },
  {
    id: 12,
    startTime: 91174,
    endTime: 92209,
    text: "“How about now?”"
  },
  {
    id: 13,
    startTime: 92209,
    endTime: 100951,
    text: "“Not yet, we still can't see what's ahead. Hold your breath, for now.”"
  },
  {
    id: 14,
    startTime: 100951,
    endTime: 110927,
    text: "( )"
  },
  {
    id: 15,
    startTime: 110927,
    endTime: 120570,
    text: "This is how it ends for a Rolling Girl, unable to reach the colors on the other side"
  },
  {
    id: 16,
    startTime: 120570,
    endTime: 130413,
    text: "The overlapping voices, they blend together, blend together"
  },
  {
    id: 17,
    startTime: 130413,
    endTime: 140257,
    text: "She mutters, \"I'm fine.\", but the words fail her"
  },
  {
    id: 18,
    startTime: 140257,
    endTime: 142692,
    text: "Not caring how it ends"
  },
  {
    id: 19,
    startTime: 142692,
    endTime: 149900,
    text: "An upward climb that invites mistakes"
  },
  {
    id: 20,
    startTime: 149900,
    endTime: 149900,
    text: "( )"
  },
  {
    id: 21,
    startTime: 149900,
    endTime: 152435,
    text: "One more time, one more time"
  },
  {
    id: 22,
    startTime: 152435,
    endTime: 155005,
    text: "Please, get me rolling"
  },
  {
    id: 23,
    startTime: 155005,
    endTime: 157340,
    text: "The girl said, the girl said"
  },
  {
    id: 24,
    startTime: 157340,
    endTime: 160043,
    text: "With her intense silence!"
  },
  {
    id: 25,
    startTime: 160043,
    endTime: 161144,
    text: "“How about now?”"
  },
  {
    id: 26,
    startTime: 161144,
    endTime: 169819,
    text: "“Just a little more, We should see something soon. Hold your breath, for now.”"
  },
  {
    id: 27,
    startTime: 169819,
    endTime: 169819,
    text: "( )"
  },
  {
    id: 28,
    startTime: 169819,
    endTime: 172088,
    text: "One more time, one more time"
  },
  {
    id: 29,
    startTime: 172088,
    endTime: 174691,
    text: "“I'll roll along again today”"
  },
  {
    id: 30,
    startTime: 174691,
    endTime: 177027,
    text: "The girl said, the girl said"
  },
  {
    id: 31,
    startTime: 177027,
    endTime: 179663,
    text: "Breathing laughter into the words!"
  },
  {
    id: 32,
    startTime: 179663,
    endTime: 184668,
    text: "“How about now? OK, you can look. You must be exhausted too, right?”"
  },
  {
    id: 33,
    startTime: 184668,
    endTime: 189573,
    text: "We’ll hold our breath, right now."
  }
];

describe('POST lyrics', () => {

  it('should fail to add lyrics with a user access token', async () => {
    const response = await request(app)
      .post(entrypoints.songs + '/1/timed-lyrics')
      .set('access_token', user_access_token)
      .send(testData);
    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBeDefined();
  });

  it('should fail to add lyrics with no access token', async () => {
    const response = await request(app)
      .post(entrypoints.songs + '/1/timed-lyrics')
      .send(testData);
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBeDefined();
  });

  it('should fail to add lyrics with invalid access token', async () => {
    const response = await request(app)
      .post(entrypoints.songs + '/1/timed-lyrics')
      .set('access_token', "abhjavhjsvjgsfvh")
      .send(testData);
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBeDefined();
  });

  it('should fail to add lyrics with invalid input', async () => {
    const response = await request(app)
      .post(entrypoints.songs + '/1/timed-lyrics')
      .set('access_token', admin_access_token)
      .send({
        srt: "asnkbvabkhbfhkqbfhjbkjfqb"
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBeDefined();
  });

  it('should fail to add lyrics for a song with invalid id', async () => {
    const response = await request(app)
      .post(entrypoints.songs + '/nan/timed-lyrics')
      .set('access_token', admin_access_token)
      .send(testData);
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBeDefined();
  });

  it('should fail to add lyrics for a song with non-existent id', async () => {
    const response = await request(app)
      .post(entrypoints.songs + '/100/timed-lyrics')
      .set('access_token', admin_access_token)
      .send(testData);
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBeDefined();
  });

  it('should fail to add lyrics for a song if no data is sent', async () => {
    const response = await request(app)
      .post(entrypoints.songs + '/1/timed-lyrics')
      .set('access_token', admin_access_token)
      .send({});
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBeDefined();
  });

  it('should fail to add lyrics for a song if no data is sent', async () => {
    const response = await request(app)
      .post(entrypoints.songs + '/1/timed-lyrics')
      .set('access_token', admin_access_token)
      .send({srt: ''});
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBeDefined();
  });

  it('should successfully add lyrics', async () => {
    const response = await request(app)
      .post(entrypoints.songs + '/1/timed-lyrics')
      .set('access_token', admin_access_token)
      .send(testData);
    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBeDefined();

    const fetchResponse = await request(app)
      .get(entrypoints.songs + '/1');
    expect(fetchResponse.statusCode).toBe(200);
    const { timedLyrics } = fetchResponse.body;
    expect(timedLyrics).toBeDefined();
    expect(timedLyrics).toEqual(expectedParsed);
  });

  it('should successfully add lyrics with a staff access token', async () => {
    const response = await request(app)
      .post(entrypoints.songs + '/2/timed-lyrics')
      .set('access_token', staff_access_token)
      .send(testData);
    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBeDefined();

    const fetchResponse = await request(app)
      .get(entrypoints.songs + '/2');
    expect(fetchResponse.statusCode).toBe(200);
    const { timedLyrics } = fetchResponse.body;
    expect(timedLyrics).toBeDefined();
    expect(timedLyrics).toEqual(expectedParsed);
  });

});

describe('PUT lyrics', () => {

  const testData = {
    srt: `1\n00:00:31,982 --> 00:00:41,892\nFor lonely girls, it's always the same, dreaming dreams that don't come true\n\n2\n00:00:41,892 --> 00:00:51,768\nAnd churning, churning through the clamor in their heads`
  };
  const expectedParsed = [
    {
      id: 1,
      startTime: 31982,
      endTime: 41892,
      text: "For lonely girls, it's always the same, dreaming dreams that don't come true"
    },
    {
      id: 2,
      startTime: 41892,
      endTime: 51768,
      text: "And churning, churning through the clamor in their heads"
    }
  ];

  it('should fail to update lyrics with a user access token', async () => {
    const response = await request(app)
      .put(entrypoints.songs + '/1/timed-lyrics/1')
      .set('access_token', user_access_token)
      .send(testData);
    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBeDefined();
  });

  it('should fail to update lyrics with no access token', async () => {
    const response = await request(app)
      .put(entrypoints.songs + '/1/timed-lyrics/1')
      .send(testData);
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBeDefined();
  });

  it('should fail to update lyrics with invalid access token', async () => {
    const response = await request(app)
      .put(entrypoints.songs + '/1/timed-lyrics/1')
      .set('access_token', "abhjavhjsvjgsfvh")
      .send(testData);
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBeDefined();
  });

  it('should fail to update lyrics with invalid input', async () => {
    const response = await request(app)
      .put(entrypoints.songs + '/1/timed-lyrics/1')
      .set('access_token', admin_access_token)
      .send({
        srt: "asnkbvabkhbfhkqbfhjbkjfqb"
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBeDefined();
  });

  it('should fail to update lyrics for a song with invalid id', async () => {
    const response = await request(app)
      .put(entrypoints.songs + '/nan/timed-lyrics/1')
      .set('access_token', admin_access_token)
      .send(testData);
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBeDefined();
  });

  it('should fail to update lyrics for a song with non-existent id', async () => {
    const response = await request(app)
      .put(entrypoints.songs + '/100/timed-lyrics/1')
      .set('access_token', admin_access_token)
      .send(testData);
    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBeDefined();
  });

  it('should fail to update lyrics for a song if no data is sent', async () => {
    const response = await request(app)
      .put(entrypoints.songs + '/1/timed-lyrics/1')
      .set('access_token', admin_access_token)
      .send({});
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBeDefined();
  });

  it('should fail to update lyrics for a song if no data is sent', async () => {
    const response = await request(app)
      .put(entrypoints.songs + '/1/timed-lyrics/1')
      .set('access_token', admin_access_token)
      .send({srt: ''});
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBeDefined();
  });

  it('should successfully update lyrics', async () => {
    const response = await request(app)
      .put(entrypoints.songs + '/1/timed-lyrics/1')
      .set('access_token', admin_access_token)
      .send(testData);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBeDefined();

    const fetchResponse = await request(app)
      .get(entrypoints.songs + '/1');
    expect(fetchResponse.statusCode).toBe(200);
    const { timedLyrics } = fetchResponse.body;
    expect(timedLyrics).toBeDefined();
    expect(timedLyrics).toEqual(expectedParsed);
  });

  it('should successfully update lyrics with a staff access token', async () => {
    const response = await request(app)
      .put(entrypoints.songs + '/2/timed-lyrics/2')
      .set('access_token', staff_access_token)
      .send(testData);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBeDefined();

    const fetchResponse = await request(app)
      .get(entrypoints.songs + '/2');
    expect(fetchResponse.statusCode).toBe(200);
    const { timedLyrics } = fetchResponse.body;
    expect(timedLyrics).toBeDefined();
    expect(timedLyrics).toEqual(expectedParsed);
  });

});


describe('DELETE lyrics', () => {

  it('should fail to delete lyrics with a user access token', async () => {
    const response = await request(app)
      .delete(entrypoints.songs + '/1/timed-lyrics/1')
      .set('access_token', user_access_token);
    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBeDefined();

    const fetchResponse = await request(app)
      .get(entrypoints.songs + '/1');
    expect(fetchResponse.statusCode).toBe(200);
    const { timedLyrics } = fetchResponse.body;
    expect(timedLyrics).toBeDefined();
    expect(timedLyrics).not.toBeNull();
  });

  it('should fail to delete lyrics with a staff user token', async () => {
    const response = await request(app)
      .delete(entrypoints.songs + '/1/timed-lyrics/1')
      .set('access_token', staff_access_token);
    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBeDefined();

    const fetchResponse = await request(app)
      .get(entrypoints.songs + '/1');
    expect(fetchResponse.statusCode).toBe(200);
    const { timedLyrics } = fetchResponse.body;
    expect(timedLyrics).toBeDefined();
    expect(timedLyrics).not.toBeNull();
  });

  it('should fail to delete lyrics with no access token', async () => {
    const response = await request(app)
      .delete(entrypoints.songs + '/1/timed-lyrics/1');
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBeDefined();
  });

  it('should fail to add lyrics with invalid access token', async () => {
    const response = await request(app)
      .delete(entrypoints.songs + '/1/timed-lyrics/1')
      .set('access_token', "abhjavhjsvjgsfvh");
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBeDefined();
  });

  it('should fail to add lyrics with non-matching SongId', async () => {
    const response = await request(app)
      .delete(entrypoints.songs + '/2/timed-lyrics/1')
      .set('access_token', admin_access_token);
    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBeDefined();
  });

  it('should successfully delete lyrics', async () => {
    const response = await request(app)
      .delete(entrypoints.songs + '/1/timed-lyrics/1')
      .set('access_token', admin_access_token);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBeDefined();

    const fetchResponse = await request(app)
      .get(entrypoints.songs + '/1');
    expect(fetchResponse.statusCode).toBe(200);
    const { timedLyrics } = fetchResponse.body;
    expect(timedLyrics).toBeDefined();
    expect(timedLyrics).toBeNull();
  });

  it('should fail to delete lyrics for a song with invalid id', async () => {
    const response = await request(app)
      .delete(entrypoints.songs + '/nan/timed-lyrics/1')
      .set('access_token', admin_access_token);
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBeDefined();
  });

  it('should fail to delete lyrics for a song with non-existent id', async () => {
    const response = await request(app)
      .delete(entrypoints.songs + '/100/timed-lyrics/1')
      .set('access_token', admin_access_token);
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBeDefined();
  });

  it('should fail to delete lyrics with invalid id', async () => {
    const response = await request(app)
      .delete(entrypoints.songs + '/1/timed-lyrics/nan')
      .set('access_token', admin_access_token);
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBeDefined();
  });

  it('should fail to delete non-existent lyrics for a song', async () => {
    const response = await request(app)
      .delete(entrypoints.songs + '/1/timed-lyrics/100')
      .set('access_token', admin_access_token);
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBeDefined();
  });

});