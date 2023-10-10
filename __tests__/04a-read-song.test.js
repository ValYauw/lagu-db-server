const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');
const entrypoints = require('../config/testing-entrypoints');

const dummyDate = new Date('2020-01-01T00:00:00');

/* 
 * START SEED DATA
 */
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
    name: 'Wowaka',
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
  {
    name: 'Eve',
    createdAt: dummyDate,
    updatedAt: dummyDate
  }
];
const songs = [
  {
    name: "Rolling Girl",
    releaseDate: new Date("2010-02-14T00:00:00"),
    songType: "Original",
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
  {
    name: "Ura Omote Lovers",
    releaseDate: new Date("2009-08-29T00:00:00"),
    songType: "Original",
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
  {
    name: "Unhappy Refrain",
    releaseDate: new Date("2011-05-02T00:00:00"),
    songType: "Original",
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
  {
    name: "Dramaturgy",
    releaseDate: new Date("2017-10-11T00:00:00"),
    songType: "Original",
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
  {
    name: "Nonsense Bungaku",
    releaseDate: new Date("2017-05-20T00:00:00"),
    songType: "Original",
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
  {
    name: "Oki ni Mesu mama",
    releaseDate: new Date("2017-11-29T00:00:00"),
    songType: "Original",
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
  {
    name: "Tokyo Ghetto",
    releaseDate: new Date("2018-07-06T00:00:00"),
    songType: "Original",
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
  {
    name: "Last Dance",
    releaseDate: new Date("2018-12-14T00:00:00"),
    songType: "Original",
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
  {
    name: "Outsider",
    releaseDate: new Date("2018-04-07T00:00:00"),
    songType: "Original",
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
  {
    name: "Rolling Girl",
    releaseDate: new Date("2017-02-14T00:00:00"),
    songType: "Cover",
    parentId: 1,
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
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
    SongId: 1,
    ArtistId: 2,
    role: 'composer',
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
  {
    SongId: 2,
    ArtistId: 2,
    role: 'composer',
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
  {
    SongId: 3,
    ArtistId: 2,
    role: 'composer',
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
  {
    SongId: 4,
    ArtistId: 3,
    role: 'composer, vocalist',
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
  {
    SongId: 5,
    ArtistId: 3,
    role: 'composer, vocalist',
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
  {
    SongId: 6,
    ArtistId: 3,
    role: 'composer, vocalist',
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
  {
    SongId: 7,
    ArtistId: 3,
    role: 'composer, vocalist',
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
  {
    SongId: 8,
    ArtistId: 3,
    role: 'composer, vocalist',
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
  {
    SongId: 9,
    ArtistId: 3,
    role: 'composer, vocalist',
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
  {
    SongId: 10,
    ArtistId: 3,
    role: 'cover artist',
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
  },
  {
    songURL: "https://www.youtube.com/watch?v=jJzw1h5CR-I",
    isInactive: false,
    SongId: 4,
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
  {
    songURL: "https://www.youtube.com/watch?v=OskXF3s0UT8",
    isInactive: false,
    SongId: 5,
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
  {
    songURL: "https://www.youtube.com/watch?v=nROvY9uiYYk",
    isInactive: false,
    SongId: 6,
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
  {
    songURL: "https://www.youtube.com/watch?v=PvzBWFGEz8M",
    isInactive: false,
    SongId: 7,
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
  {
    songURL: "https://www.youtube.com/watch?v=CLdeykXCZX4",
    isInactive: false,
    SongId: 8,
    createdAt: dummyDate,
    updatedAt: dummyDate
  },
  {
    songURL: "https://www.youtube.com/watch?v=GMPjNA_fCj4",
    isInactive: false,
    SongId: 9,
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
  { SongId: 4, GenreId: 2, createdAt: dummyDate, updatedAt: dummyDate },
  { SongId: 5, GenreId: 2, createdAt: dummyDate, updatedAt: dummyDate },
  { SongId: 6, GenreId: 2, createdAt: dummyDate, updatedAt: dummyDate },
  { SongId: 7, GenreId: 2, createdAt: dummyDate, updatedAt: dummyDate },
  { SongId: 8, GenreId: 2, createdAt: dummyDate, updatedAt: dummyDate },
  { SongId: 9, GenreId: 2, createdAt: dummyDate, updatedAt: dummyDate }
];
const timedLyrics = [
  {
    SongId: 1,
    timedLyrics: `1\n00:00:31,982 --> 00:00:41,892\nFor lonely girls, it's always the same, dreaming dreams that don't come true\n\n2\n00:00:41,892 --> 00:00:51,768\nAnd churning, churning through the clamor in their heads\n\n3\n00:00:51,768 --> 00:01:01,478\n( )\n\n4\n00:01:01,478 --> 00:01:11,354\nA lonely girl mutters "I'm fine", have words failed her?\n\n5\n00:01:11,354 --> 00:01:13,623\nA failure, a failure.\n\n6\n00:01:13,623 --> 00:01:21,198\nObsessing over her mistakes makes everything spin again!\n\n7\n00:01:21,198 --> 00:01:21,198\n( )\n\n8\n00:01:21,198 --> 00:01:23,533\nOne more time, one more time\n\n9\n00:01:23,533 --> 00:01:25,936\n“I'll roll along today”\n\n10\n00:01:25,936 --> 00:01:28,405\nThe girl said, the girl said\n\n11\n00:01:28,405 --> 00:01:31,174\nBreathing life into the words!\n\n12\n00:01:31,174 --> 00:01:32,209\n“How about now?”\n\n13\n00:01:32,209 --> 00:01:40,951\n“Not yet, we still can't see what's ahead. Hold your breath, for now.”\n\n14\n00:01:40,951 --> 00:01:50,927\n( )\n\n15\n00:01:50,927 --> 00:02:00,570\nThis is how it ends for a Rolling Girl, unable to reach the colors on the other side\n\n16\n00:02:00,570 --> 00:02:10,413\nThe overlapping voices, they blend together, blend together\n\n17\n00:02:10,413 --> 00:02:20,257\nShe mutters, "I'm fine.", but the words fail her\n\n18\n00:02:20,257 --> 00:02:22,692\nNot caring how it ends\n\n19\n00:02:22,692 --> 00:02:29,900\nAn upward climb that invites mistakes\n\n20\n00:02:29,900 --> 00:02:29,900\n( )\n\n21\n00:02:29,900 --> 00:02:32,435\nOne more time, one more time\n\n22\n00:02:32,435 --> 00:02:35,005\nPlease, get me rolling\n\n23\n00:02:35,005 --> 00:02:37,340\nThe girl said, the girl said\n\n24\n00:02:37,340 --> 00:02:40,043\nWith her intense silence!\n\n25\n00:02:40,043 --> 00:02:41,144\n“How about now?”\n\n26\n00:02:41,144 --> 00:02:49,819\n“Just a little more, We should see something soon. Hold your breath, for now.”\n\n27\n00:02:49,819 --> 00:02:49,819\n( )\n\n28\n00:02:49,819 --> 00:02:52,088\nOne more time, one more time\n\n29\n00:02:52,088 --> 00:02:54,691\n“I'll roll along again today”\n\n30\n00:02:54,691 --> 00:02:57,027\nThe girl said, the girl said\n\n31\n00:02:57,027 --> 00:02:59,663\nBreathing laughter into the words!\n\n32\n00:02:59,663 --> 00:03:04,668\n“How about now? OK, you can look. You must be exhausted too, right?”\n\n33\n00:03:04,668 --> 00:03:09,573\nWe’ll hold our breath, right now.`,
    createdAt: dummyDate,
    updatedAt: dummyDate
  }
]
/* 
 * END SEED DATA
 */

beforeAll(async () => {
  await sequelize.queryInterface.bulkInsert('Genres', genres);
  await sequelize.queryInterface.bulkInsert('Artists', artists);
  await sequelize.queryInterface.bulkInsert('Songs', songs);
  await sequelize.queryInterface.bulkInsert('SongGenres', songGenres);
  await sequelize.queryInterface.bulkInsert('SongArtists', songArtists);
  await sequelize.queryInterface.bulkInsert('PlayLinks', playLinks);
  await sequelize.queryInterface.bulkInsert('TimedLyrics', timedLyrics);
});

afterAll(async () => {
  ['Genres', 'Artists', 'Songs', 'SongGenres', 'SongArtists', 'PlayLinks', 'TimedLyrics'].forEach(async (tableName) => {
    await sequelize.queryInterface.bulkDelete(tableName, null, {
      restartIdentity: true,
      cascade: true,
      truncate: true
    });
  });
});

describe('GET songs', () => {

  it('should get the list of songs', async () => {
    const response = await request(app)
      .get(entrypoints.songs)
    expect(response.statusCode).toBe(200);
    const { count, offset, data } = response.body;
    expect(count).toBeDefined();
    expect(offset).toBeDefined();
    expect(data).toBeDefined();
    expect(count).toBe(10);
    expect(data.length).toBe(10);
    const song = data[0];
    const { id, name, aliases, releaseDate, songType, artists, links } = song;
    expect(name).toBeDefined();
    expect(aliases).toBeDefined();
    expect(releaseDate).toBeDefined();
    expect(songType).toBeDefined();
    expect(artists).toBeDefined();
    expect(links).toBeDefined();
    expect(id).toBe(4);
    expect(name).toBe("Dramaturgy");
    expect(aliases).toBeNull();
    const compareDate = new Date(releaseDate);
    expect(compareDate.getFullYear()).toBe(2017);
    expect(compareDate.getMonth()).toBe(9);
    expect(compareDate.getDate()).toBe(11);
    expect(songType).toBe('Original');
    expect(artists).toEqual([{
      id: 3,
      name: 'Eve',
      aliases: null
    }]);
    expect(links).toEqual([{
      id: 8,
      songURL: 'https://www.youtube.com/watch?v=jJzw1h5CR-I',
      isInactive: false
    }]);
  });

  it('should get a specific song', async () => {
    const response = await request(app)
      .get(entrypoints.songs + '/4')
    expect(response.statusCode).toBe(200);
    const data = response.body;
    expect(data).toBeDefined();
    const { id, name, aliases, releaseDate, songType, basedOn, derivatives, genres, artists, links, timedLyrics } = data;
    expect(name).toBeDefined();
    expect(aliases).toBeDefined();
    expect(releaseDate).toBeDefined();
    expect(songType).toBeDefined();
    expect(basedOn).toBeDefined();
    expect(derivatives).toBeDefined();
    expect(genres).toBeDefined();
    expect(artists).toBeDefined();
    expect(links).toBeDefined();
    expect(timedLyrics).toBeDefined();
    expect(id).toBe(4);
    expect(name).toBe("Dramaturgy");
    expect(aliases).toBeNull();
    const compareDate = new Date(releaseDate);
    expect(compareDate.getFullYear()).toBe(2017);
    expect(compareDate.getMonth()).toBe(9);
    expect(compareDate.getDate()).toBe(11);
    expect(songType).toBe('Original');
    expect(basedOn).toBeNull();
    expect(derivatives).toEqual([]);
    expect(genres).toEqual([{
      id: 2,
      name: 'Rock'
    }]);
    expect(artists).toEqual([{
      id: 3,
      name: 'Eve',
      aliases: null
    }]);
    expect(links).toEqual([{
      id: 8,
      songURL: 'https://www.youtube.com/watch?v=jJzw1h5CR-I',
      isInactive: false
    }]);
    expect(timedLyrics).toBeNull();
  });

  it('should get a specific song', async () => {
    const response = await request(app)
      .get(entrypoints.songs + '/1')
    expect(response.statusCode).toBe(200);
    const data = response.body;
    expect(data).toBeDefined();
    const { id, name, aliases, releaseDate, songType, basedOn, derivatives, genres, artists, links, timedLyrics } = data;
    expect(name).toBeDefined();
    expect(aliases).toBeDefined();
    expect(releaseDate).toBeDefined();
    expect(songType).toBeDefined();
    expect(basedOn).toBeDefined();
    expect(derivatives).toBeDefined();
    expect(genres).toBeDefined();
    expect(artists).toBeDefined();
    expect(links).toBeDefined();
    expect(timedLyrics).toBeDefined();
    expect(id).toBe(1);
    expect(name).toBe("Rolling Girl");
    expect(aliases).toBeNull();
    const compareDate = new Date(releaseDate);
    expect(compareDate.getFullYear()).toBe(2010);
    expect(compareDate.getMonth()).toBe(1);
    expect(compareDate.getDate()).toBe(14);
    expect(songType).toBe('Original');
    expect(basedOn).toBeNull();
    expect(derivatives).toEqual([{
      id: 10,
      name: 'Rolling Girl',
      aliases: null,
      releaseDate: new Date("2017-02-14T00:00:00").toISOString(),
      songType: "Cover"
    }]);
    expect(genres).toEqual([
      { id: 1, name: 'Pop' },
      { id: 3, name: 'VOCALOID' }
    ]);
    expect(artists).toEqual([
      {
        id: 1,
        name: 'Hatsune Miku',
        aliases: ['Miku Hatsune', 'CV-01']
      },
      {
        id: 2,
        name: 'Wowaka',
        aliases: null
      },
    ]);
    expect(links).toEqual([
      {
        id: 1,
        songURL: "https://www.nicovideo.jp/watch/sm9714351",
        isInactive: false
      },
      {
        id: 2,
        songURL: "https://www.youtube.com/watch?v=vnw8zURAxkU",
        isInactive: false
      }
    ]);
    expect(timedLyrics).toEqual([
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
    ])
  });

  it('should fail to get data for a song with an invalid id', async () => {
    const response = await request(app)
      .get(entrypoints.songs + '/nan')
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBeDefined();
  });

  it('should fail to get data for a song with a non-existent id', async () => {
    const response = await request(app)
      .get(entrypoints.songs + '/100')
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBeDefined();
  });

});