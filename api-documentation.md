Table of Contents
- [List of Entrypoints](#list-of-entrypoints)
- [CRUD Privileges](#crud-privileges)
- [Global Error Codes](#global-error-codes)
  - [401 - Unauthorized](#401---unauthorized)
  - [403 - Forbidden](#403---forbidden)
  - [404 - Data Not Found](#404---data-not-found)
- [Authentication](#authentication)
  - [POST /login](#post-login)
  - [POST /glogin](#post-glogin)
  - [POST /register](#post-register)
- [Genres](#genres)
  - [GET /genres](#get-genres)
  - [POST /genres](#post-genres)
  - [GET /genres/:id](#get-genresid)
  - [PUT /genres/:id](#put-genresid)
  - [DELETE /genres/:id](#delete-genresid)
  - [GET /genres/:id/songs](#get-genresidsongs)
- [Artists](#artists)
  - [GET /artists](#get-artists)
  - [POST /artists](#post-artists)
  - [GET /artists/:id](#get-artistsid)
  - [PUT /artists/:id](#put-artistsid)
  - [DELETE /artists/:id](#delete-artistsid)
  - [GET /artists/:id/songs](#get-artistsidsongs)
- [Songs](#songs)
  - [GET /songs](#get-songs)
  - [POST /songs](#post-songs)
  - [GET /songs/:id](#get-songsid)
  - [PUT /songs/:id](#put-songsid)
  - [DELETE /songs/:id](#delete-songsid)
  - [PUT /songs/:id/genres](#put-songsidgenres)
  - [POST /songs/:id/timed-lyrics](#post-songsidtimed-lyrics)
  - [PUT /songs/:id/timed-lyrics/:lyricsId](#put-songsidtimed-lyricslyricsid)
  - [DELETE /songs/:id/timed-lyrics/:lyricsId](#delete-songsidtimed-lyricslyricsid)
- [Search](#search)
  - [GET /search/songs](#get-searchsongs)
  - [GET /search/artists](#get-searchartists)
- [Third-Party APIs](#third-party-apis)
  - [POST /youtube/artists](#post-youtubeartists)
  - [POST /vocadb/artists](#post-vocadbartists)


## List of Entrypoints

<table>
<thead>
<tr>
<th>HTTP Method</th>
<th>Entrypoint</th>
<th>Description</th>
</tr>
</thead>
<tbody>

<tr>
<td colspan=3><center><b>Authentication</b></center></td>
</tr>
<tr>
<td>POST</td>
<td><code>/login</code></td>
<td>Generates an access token for the user upon login.</td>
</tr>
<tr>
<td>POST</td>
<td><code>/glogin</code></td>
<td>Generates an access token for the user by Google OAuth login.</td>
</tr>
<tr>
<td>POST</td>
<td><code>/register</code></td>
<td>Registers a new user onto the application.</td>
</tr>

<tr>
<td colspan=3><center><b>Genres</b></center></td>
</tr>
<tr>
<td>GET</td>
<td><code>/genres</code></td>
<td>Gets a list of all genres stored in the database.</td>
</tr>
<tr>
<td>POST</td>
<td><code>/genres</code></td>
<td>Create a new genre/sub-genre and save it to the database.</td>
</tr>
<tr>
<td>GET</td>
<td><code>/genres/:id</code></td>
<td>Gets a genre by ID, along with its sub-genres.</td>
</tr>
<tr>
<td>PUT</td>
<td><code>/genres/:id</code></td>
<td>Updates an existing genre/sub-genre and save it to the database.</td>
</tr>
<tr>
<td>DELETE</td>
<td><code>/genres/:id</code></td>
<td>Deletes an existing genre/sub-genre.</td>
</tr>
<tr>
<td>GET</td>
<td><code>/genres/:id/songs</code></td>
<td>Gets the songs belonging to a specific genre.</td>
</tr>

<tr>
<td colspan=3><center><b>Artists</b></center></td>
</tr>
<tr>
<td>GET</td>
<td><code>/artists</code></td>
<td>Gets the list of artists stored in the database.</td>
<tr>
<td>POST</td>
<td><code>/artists</code></td>
<td>Create a new artist and save it to the database.</td>
</tr>
<tr>
<td>GET</td>
<td><code>/artists/:id</code></td>
<td>Gets data for a specific artist in the database, by their ID.</td>
</tr>
<tr>
<td>PUT</td>
<td><code>/artists/:id</code></td>
<td>Updates data for a specific artist in the database, by their ID.</td>
</tr>
<tr>
<td>DELETE</td>
<td><code>/artists/:id</code></td>
<td>Deletes data for a specific artist in the database, by their ID.</td>
</tr>
<tr>
<td>GET</td>
<td><code>/artists/:id/songs</code></td>
<td>Gets the list of songs for a specific artist in the database.</td>
</tr>

<tr>
<td colspan=3><center><b>Songs</b></center></td>
</tr>
<tr>
<td>GET</td>
<td><code>/songs</code></td>
<td>Gets a list of songs stored in the database.</td>
</tr>
<tr>
<td>POST</td>
<td><code>/songs</code></td>
<td>Create a new song and save it to the database.</td>
</tr>
<tr>
<td>GET</td>
<td><code>/songs/:id</code></td>
<td>Gets data for a specific song in the database, by their ID.</td>
</tr>
<tr>
<td>PUT</td>
<td><code>/songs/:id</code></td>
<td>Updates data for a specific song in the database, by their ID.</td>
</tr>
<tr>
<td>DELETE</td>
<td><code>/songs/:id</code></td>
<td>Deletes data for a specific song in the database, by their ID.</td>
</tr>
<tr>
<td>PUT</td>
<td><code>/songs/:id/genres</code></td>
<td>Updates a song's genre information.</td>
</tr>
<tr>
<td>POST</td>
<td><code>/songs/:id/timed-lyrics</code></td>
<td>Submits a set of timed lyrics for a song in the database.</td>
</tr>
<tr>
<td>PUT</td>
<td><code>/songs/:id/timed-lyrics/:lyricsId</code></td>
<td>Updates the lyrics for an existing set of timed lyrics for a song in the database.</td>
</tr>
<tr>
<td>DELETE</td>
<td><code>/songs/:id/timed-lyrics/:lyricsId</code></td>
<td>Deletes an existing set of timed lyrics for a song in the database.</td>
</tr>

<tr>
<td colspan=3><center><b>Search</b></center></td>
</tr>
<tr>
<td>GET</td>
<td><code>/search/artists</code></td>
<td>Searches for artists in the database by their name.</td>
</tr>
<tr>
<td>GET</td>
<td><code>/search/songs</code></td>
<td>Searches for songs in the database by their title.</td>
</tr>

<tr>
<td colspan=3><center><b>Third-party APIs</b></center></td>
</tr>
<tr>
<td>POST</td>
<td><code>/youtube/artists</code></td>
<td>Get the artist's recent videos as reported by the YouTube Data API.</td>
</tr>
<tr>
<td>POST</td>
<td><code>/vocadb/artists</code></td>
<td>Get the artist's top-rated VOCALOID songs as reported by the VocaDB API.</td>
</tr>

</tbody>
</table>

## CRUD Privileges

<table>

<thead>
<tr>
<th>Role</th>
<th>Read</th>
<th>Create</th>
<th>Update</th>
<th>Delete</th>
</tr>
</thead>

<tbody>

<tr>
<td>Admin</td>
<td>✅ All</td>
<td>✅ All</td>
<td>✅ All</td>
<td>✅ All</td>
</tr>

<tr>
<td>Staff</td>
<td>✅ All</td>
<td>✅ Songs, artists<br>❌ Genres</td>
<td>✅ Songs, artists<br>❌ Genres</td>
<td>❌ All</td>
</tr>

<tr>
<td>User</td>
<td>✅ All</td>
<td>❌ All</td>
<td>❌ All</td>
<td>❌ All</td>
</tr>

<tr>
<td>No Auth.</td>
<td>✅ All</td>
<td>❌ All</td>
<td>❌ All</td>
<td>❌ All</td>
</tr>

</tbody>

</table>

## Global Error Codes

### 401 - Unauthorized

```json
{
  "statusCode": 401,
  "message": "Invalid token"
}
```

```json
{
  "statusCode": 401,
  "message": "Token has expired"
}
```

### 403 - Forbidden

```json
{
  "statusCode": 403,
  "message": "Forbidden access"
}
```

### 404 - Data Not Found

```json
{
  "statusCode": 404,
  "message": "Data not found"
}
```

## Authentication

### POST /login

Generates an access token for the user upon login.

Request Body
```json
{
  "email": "john.doe@mail.com",
  "password": "password"
}
```

Response - 200 OK
```json
{
  "access_token": ...
}
```

Response - 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Invalid username/password"
}
```

### POST /glogin

Generates an access token for the user by Google OAuth login.

Request Headers
```json
{
  ...
  "google_token": ...
}
```

Response - 200 OK
```json
{
  "access_token": ...
}
```

### POST /register

Registers a new user onto the application.

Request Body
```json
{
  "username": "Jill Jones",
  "email": "jill.jones@mail.com",
  "password": "password"
}
```

Response - 201 Created
```json
{
  "message": "Registration successful"
}
```

Response - 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Username is required"
}

{
  "statusCode": 400,
  "message": "Email is required"
}

{
  "statusCode": 400,
  "message": "Password is required"
}

{
  "statusCode": 400,
  "message": "Password must be at least 8 characters long"
}

{
  "statusCode": 400,
  "message": "Username is already registered"
}

{
  "statusCode": 400,
  "message": "Email is already registered"
}
```

## Genres

### GET /genres

Gets a list of all genres stored in the database.

Response - 200 OK
```json
[
  {
    "id": 5,
    "name": "Country",
    "subGenres": []
  },
  {
    "id": 1,
    "name": "Pop",
    "subGenres": [
      {
        "id": 2,
        "name": "C-Pop"
      },
      {
        "id": 3,
        "name": "J-Pop"
      },
      {
        "id": 4,
        "name": "K-Pop"
      }
    ]
  }
]
```

### POST /genres

Create a new genre/sub-genre and save it to the database.

Request - Headers
```json
{
  ...
  "access_token": ...
}
```

Request - Body
```json
{
  "name": "Metalcore",
  "parentId": 1
}
```

Response - 201 Created
```json
{
  "message": "Successfully added genre"
}
```

### GET /genres/:id

Gets a genre by ID, along with its sub-genres.

Path Parameters
 - `id`: Genre ID

Response - 200 OK
```json
{
  "id": 1,
  "name": "Pop",
  "subGenres": [
    {
      "id": 17,
      "name": "C-Pop"
    },
    {
      "id": 18,
      "name": "J-Pop"
    },
    {
      "id": 16,
      "name": "K-Pop"
    }
  ],
  "parentGenre": null
}
```

### PUT /genres/:id

Updates an existing genre/sub-genre and save it to the database.

Path Parameters
 - `id`: Genre ID

Request - Headers
```json
{
  ...
  "access_token": ...
}
```

Request - Body
```json
{
  "name": "Metalcore",
  "parentId": 1
}
```

Response - 200 OK
```json
{
  "message": "Successfully edited genre"
}
```

### DELETE /genres/:id

Deletes an existing genre/sub-genre.

Path Parameters
 - `id`: Genre ID

Request - Headers
```json
{
  ...
  "access_token": ...
}
```

Response - 200 OK
```json
{
  "message": "Successfully deleted genre"
}
```

### GET /genres/:id/songs

Gets the songs belonging to a specific genre.

Path Parameters
 - `id`: Genre ID

Response - 200 OK
```json
{
  "count": 14,
  "offset": 0,
  "data": [
    {
      "id": 5,
      "name": "アンハッピーリフレイン",
      "aliases": [
        "Unhappy Refrain"
      ],
      "releaseDate": "2011-05-02T00:00:00.000Z",
      "songType": "Original",
      "artists": [
        {
          "id": 1,
          "name": "初音ミク"
        },
        {
          "id": 2,
          "name": "wowaka"
        }
      ],
      "links": [
        {
          "id": 11,
          "songURL": "https://www.nicovideo.jp/watch/sm14330479",
          "isInactive": false
        },
        {
          "id": 12,
          "songURL": "https://www.youtube.com/watch?v=uMlv9VWAxko",
          "isInactive": false
        }
      ]
    },
    ...
  ]
}
```

## Artists

### GET /artists

Gets the list of artists stored in the database.

Query Parameters
 - `limit`: Number of records to fetch per API call.
 - `offset`: Number of records to offset by (for pagination).

Response - 200 OK
```json
{
  "count": 4,
  "offset": 0,
  "data": [
    {
      "id": 1,
      "name": "初音ミク",
      "aliases": [
          "Hatsune Miku"
      ],
      "imageURL": "",
      "description": "A Japanese female voicebank released for the vocal synthesizer software VOCALOID by Crypton Future Media.",
      "createdAt": "2023-10-09T12:49:17.646Z",
      "numSongs": 14
    },
    ...
  ]
}
```

### POST /artists

Create a new artist and save it to the database.

When posting to this entrypoint, the sub-resource ArtistLink is created alongside the main resource Artist. Use the `links` property of the request body to add each ArtistLink.

Request - Headers
```json
{
  ...
  "access_token": ...
}
```

Request - Body
```json
{
  "name": "Kagamine Rin",
  "aliases": ["Rin Kagamine", "CV-02"],
  "imageURL": "https://image-url.net/1234",
  "description": "Japanese VOCALOID bank.",
  "links": [
    {
      "webURL": "https://en.wikipedia.org/wiki/Kagamine_Rin/Len",
      "description": "Wikipedia (JP)"
    },
    {
      "webURL": "https://www.youtube.com/watch?v=abhbaac12f",
      "description": "VEVO Account",
      "isInactive": true
    }
  ]
}
```

Response - 201 Created
```json
{
  "message": "Successfully created artist"
}
```

### GET /artists/:id

Gets data for a specific artist in the database, by their ID.

Path Parameters
 - `id`: Artist ID

Response - 200 OK
```json
{
  "id": 1,
  "name": "初音ミク",
  "aliases": [
    "Hatsune Miku"
  ],
  "imageURL": "https://upload.wikimedia.org/wikipedia/id/9/93/Hatsune_Miku.png",
  "description": "A Japanese female voicebank released for the vocal synthesizer software VOCALOID by Crypton Future Media.",
  "links": [
    {
      "id": 1,
      "webURL": "https://en.wikipedia.org/wiki/Hatsune_Miku",
      "description": "Wikipedia",
      "isInactive": false
    },
    {
      "id": 2,
      "webURL": "https://ec.crypton.co.jp/pages/prod/vocaloid/mikuv4x",
      "description": "Official webpage (JP)",
      "isInactive": false
    }
  ]
}
```

### PUT /artists/:id

Updates data for a specific artist in the database, by their ID.

When posting to this entrypoint, the sub-resource ArtistLink is updated alongside the main resource Artist. Use the `links` property of the request body to update/add/delete each ArtistLink.

Path Parameters
 - `id`: Artist ID

Request - Headers
```json
{
  ...
  "access_token": ...
}
```

Request - Body
```json
{
  "id": 2,
  "name": "Kagamine Rin",
  "aliases": [],
  "imageURL": "https://image-url.net/abcd",
  "description": "Japanese female VOCALOID bank. Released in December 2007.",
  "links": [
    {
      "id": 3,
      "webURL": "https://en.wikipedia.org/wiki/Kagamine_Rin/Len",
      "description": "Wikipedia (JP)",
      "isInactive": false
    },
    {
      "id": 4,
      "webURL": "https://www.youtube.com/watch?v=abhbaac12f",
      "description": "VEVO Account",
      "isInactive": true
    },
    {
      "webURL": "https://vocadb.net",
      "description": "VOCALOID database",
      "isInactive": false
    }
  ]
}
```

Response - 200 OK
```json
{
  "message": "Successfully edited artist"
}
```

### DELETE /artists/:id

Deletes data for a specific artist in the database, by their ID.

When posting to this entrypoint, the sub-resource ArtistLink is deleted alongside the main resource Artist.

Path Parameters
 - `id`: Artist ID

Request - Headers
```json
{
  ...
  "access_token": ...
}
```

Response - 200 OK
```json
{
  "message": "Successfully deleted artist"
}
```

### GET /artists/:id/songs

Gets the list of songs for a specific artist in the database.

Path Parameters
 - `id`: Artist ID

Query Parameters
 - `limit`: Number of records to fetch per API call.
 - `offset`: Number of records to offset by (for pagination).

Response - 200 OK
```json
{
  "count": 14,
  "offset": 0,
  "data": [
    {
      "id": 5,
      "name": "アンハッピーリフレイン",
      "aliases": [
        "Unhappy Refrain"
      ],
      "releaseDate": "2011-05-02T00:00:00.000Z",
      "songType": "Original",
      "parentId": null,
      "artists": [
        {
          "id": 2,
          "name": "wowaka",
          "aliases": null
        },
        {
          "id": 1,
          "name": "初音ミク",
          "aliases": [
            "Hatsune Miku"
          ]
        }
      ],
      "links": [
        {
          "id": 11,
          "songURL": "https://www.nicovideo.jp/watch/sm14330479",
          "isInactive": false
        },
        {
          "id": 12,
          "songURL": "https://www.youtube.com/watch?v=uMlv9VWAxko",
          "isInactive": false
        }
      ]
    },
    ...
  ]
}
```

## Songs

### GET /songs

Gets a list of songs stored in the database.

Query Parameters
 - `limit`: Number of records to fetch per API call.
 - `offset`: Number of records to offset by (for pagination).

Response - 200 OK
```json
{
  "count": 22,
  "offset": 0,
  "data": [
    {
      "id": 5,
      "name": "アンハッピーリフレイン",
      "aliases": [
        "Unhappy Refrain"
      ],
      "releaseDate": "2011-05-02T00:00:00.000Z",
      "songType": "Original",
      "parentId": null,
      "createdAt": "2023-10-09T12:49:17.651Z",
      "artists": [
        {
          "id": 1,
          "name": "初音ミク",
          "aliases": [
            "Hatsune Miku"
          ]
        },
        {
          "id": 2,
          "name": "wowaka",
          "aliases": null
        }
      ],
      "links": [
        {
          "id": 12,
          "songURL": "https://www.youtube.com/watch?v=uMlv9VWAxko",
          "isInactive": false
        },
        {
          "id": 11,
          "songURL": "https://www.nicovideo.jp/watch/sm14330479",
          "isInactive": false
        }
      ]
    },
    ...        
  ]
}
```

### POST /songs

Create a new song and save it to the database.

When posting to this entrypoint, the sub-resources SongArtist and PlayLink are created alongside the main resource Song. Use the `artists`, `links` properties of the request body to add each SongArtist and PlayLink, respectively.

Request - Headers
```json
{
  ...
  "access_token": ...
}
```

Request - Body
```json
{
  "name": "ドラマツルギー", 
  "aliases": ["Dramaturgy"], 
  "releaseDate": "2017-10-11T00:00:00", 
  "songType": "Original", 
  "parentId": null, 
  "artists": [
    {
      "id": 2,
      "role": "composer, singer"
    }
  ], 
  "links": [
    {
      "songURL": "https://www.youtube.com/watch?v=jJzw1h5CR-I",
      "isInactive": false
    }
  ]
}
```

Response - 201 Created
```json
{
  "message": "Successfully created song"
}
```

### GET /songs/:id

Gets data for a specific song in the database, by their ID.

Path Parameters
 - `id`: Song ID

Response - 200 OK
```json
{
  "id": 1,
  "name": "ローリンガール",
  "aliases": [
    "Rolling Girl"
  ],
  "releaseDate": "2010-02-14T00:00:00.000Z",
  "songType": "Original",
  "parentId": null,
  "basedOn": null,
  "derivatives": [],
  "genres": [
    {
      "id": 2,
      "name": "Rock"
    },
    {
      "id": 3,
      "name": "Metal"
    }
  ],
  "artists": [
    {
      "id": 1,
      "name": "初音ミク",
      "aliases": [
        "Hatsune Miku"
      ],
      "role": "Vocalist"
    },
    {
      "id": 2,
      "name": "wowaka",
      "aliases": null,
      "role": "Composer"
    }
  ],
  "links": [
    {
      "id": 1,
      "songURL": "https://www.nicovideo.jp/watch/sm9714351",
      "isInactive": false
    },
    {
      "id": 2,
      "songURL": "https://www.youtube.com/watch?v=vnw8zURAxkU",
      "isInactive": false
    }
  ],
  "timedLyrics": [
    {
      "id": 1,
      "startTime": 31982,
      "endTime": 41892,
      "text": "For lonely girls, it's always the same, dreaming dreams that don't come true"
    },
    ...
  ]
}
```

### PUT /songs/:id

Updates data for a specific song in the database, by their ID.

When posting to this entrypoint, the sub-resources SongArtist and PlayLink are updated alongside the main resource Song. Use the `artists`, `links` properties of the request body to update/add/remove each SongArtist and PlayLink, respectively.

Path Parameters
 - `id`: Song ID

Request - Headers
```json
{
  ...
  "access_token": ...
}
```

Request - Body
```json
{
  "id": 2,
  "name": "Ura Omote Lovers", 
  "aliases": ["裏表ラバーズ"], 
  "releaseDate": "2009-08-26T00:00:00", 
  "songType": "Cover", 
  "parentId": 1, 
  "artists": [{
    "id": 1,
    "role": "vocalist",
  }], 
  "links": [
    {
      "id": 3,
      "songURL": "https://www.nicovideo.jp/watch/sm8082467",
      "isInactive": false
    },
    {
      "songURL": "https://www.youtube.com/watch?v=b_cuMcDWwsI",
      "isInactive": false
    }
  ]
}
```

Response - 200 OK
```json
{
  "message": "Successfully edited song"
}
```

### DELETE /songs/:id

Deletes data for a specific song in the database, by their ID.

When posting to this entrypoint, the sub-resources SongArtist and PlayLink are deleted alongside the main resource Song. The resource Artist is unaffected.

Path Parameters
 - `id`: Song ID

Request - Headers
```json
{
  ...
  "access_token": ...
}
```

Response - 200 OK
```json
{
  "message": "Successfully deleted song"
}
```

### PUT /songs/:id/genres

Updates a song's genre information.

Path Parameters
 - `id`: Song ID

Request - Headers
```json
{
  ...
  "access_token": ...
}
```

Request - Body
```json
{
  "genres": [
    { "id": 3 },
    { "id": 2 }
  ]
}
```

Response - 200 OK
```json
{
  "message": "Successfully updated song genres"
}
```

### POST /songs/:id/timed-lyrics

Submits a set of timed lyrics for a song in the database.

Path Parameters
 - `id`: Song ID

Request - Headers
```json
{
  ...
  "access_token": ...
}
```

Request - Body
```json
{
  "srt": "1\n00:00:31,982 --> 00:00:41,892\nFor lonely girls, it's always the same, dreaming dreams that don't come true\n\n2\n00:00:41,892 --> 00:00:51,768\nAnd churning, churning through the clamor in their heads"
}
```

Response - 201 Created
```json
{
  "message": "Successfully added lyrics"
}
```

Response - 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "SubRip Text contents required."
}

{
  "statusCode": 400,
  "message": "Invalid SubRip Text contents."
}
```

### PUT /songs/:id/timed-lyrics/:lyricsId

Updates the lyrics for an existing set of timed lyrics for a song in the database.

Path Parameters
 - `id`: Song ID
 - `lyricsId`: Timed Lyrics ID

Request - Headers
```json
{
  ...
  "access_token": ...
}
```

Request - Body
```json
{
  "srt": "1\n00:00:31,982 --> 00:00:41,892\nFor lonely girls, it's always the same, dreaming dreams that don't come true\n\n2\n00:00:41,892 --> 00:00:51,768\nAnd churning, churning through the clamor in their heads"
}
```

Response - 200 OK
```json
{
  "message": "Successfully edited lyrics"
}
```

Response - 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "SubRip Text contents required."
}

{
  "statusCode": 400,
  "message": "Invalid SubRip Text contents."
}
```

### DELETE /songs/:id/timed-lyrics/:lyricsId

Deletes an existing set of timed lyrics for a song in the database.

Path Parameters
 - `id`: Song ID
 - `lyricsId`: Timed Lyrics ID

Request - Headers
```json
{
  ...
  "access_token": ...
}
```

Response - 200 OK
```json
{
  "message": "Successfully deleted lyrics"
}
```

## Search

### GET /search/songs

Searches for artists in the database by their name.

Query Parameters
 - `title`: Substring to search in the artists' name.
 - `limit`: Number of records to fetch per API call.
 - `offset`: Number of records to offset by (for pagination).

Response - 200 OK
```json
{
  "count": 1,
  "offset": 0,
  "data": [
    {
      "id": 1,
      "name": "初音ミク",
      "alias": "Hatsune Miku"
    }
  ]
}
```

### GET /search/artists

Searches for songs in the database by their title.

Query Parameters
 - `title`: Substring to search in the artists' name.
 - `limit`: Number of records to fetch per API call.
 - `offset`: Number of records to offset by (for pagination).

Response - 200 OK
```json
{
  "count": 1,
  "offset": 0,
  "data": [
    {
      "id": 1,
      "name": "ローリンガール",
      "alias": "Rolling Girl"
    }
  ]
}
```

## Third-Party APIs

### POST /youtube/artists

Get the artist's recent videos as reported by the YouTube Data API.

Request Body
```json
{
  "channelUrl": "https://www.youtube.com/channel/UCUXfRsEIJ9xO1DT7TbEWksw"
}
```

Response - 200 OK
```json
{
  "channelId": "UCUXfRsEIJ9xO1DT7TbEWksw",
  "title": "Eve",
  "description": "Eve - OFFICIAL CHANNEL",
  "customUrl": "@ooo0eve0ooo",
  "publishedAt": "2013-11-10T02:48:09Z",
  "imageUrl": {
    "url": "https://yt3.ggpht.com/fw8zOGJrIuaYXSaQNuOpAsOi7CBboTWY9rbctP-S378bMLzVWbnz2GbzCb88jJOFsw3fdQfSKQ=s800-c-k-c0x00ffffff-no-nd-rj",
    "width": 800,
    "height": 800
  },
  "uploads": [
    {
      "title": "虎狼来 Music Animation #Shorts",
      "imageUrl": {
        "url": "https://i.ytimg.com/vi/EjoyPVwH6Yo/hqdefault.jpg",
        "width": 480,
        "height": 360
      },
      "videoId": "EjoyPVwH6Yo",
      "publishedAt": "2023-08-30T11:02:03Z"
    },
    {
      "title": "虎狼来 (Kororon) - Eve Music Video",
      "imageUrl": {
        "url": "https://i.ytimg.com/vi/Gw96jPDtoDQ/hqdefault.jpg",
        "width": 480,
        "height": 360
      },
      "videoId": "Gw96jPDtoDQ",
      "publishedAt": "2023-08-27T09:28:37Z"
    },
    {
      "title": "虎狼来 dance ver",
      "imageUrl": {
        "url": "https://i.ytimg.com/vi/zvPhEwzTMnc/hqdefault.jpg",
        "width": 480,
        "height": 360
      },
      "videoId": "zvPhEwzTMnc",
      "publishedAt": "2023-08-18T10:20:43Z"
    },
    {
      "title": "冒険録 (Adventure Log) - Eve Music Video",
      "imageUrl": {
        "url": "https://i.ytimg.com/vi/z9c5tlQHXWM/hqdefault.jpg",
        "width": 480,
        "height": 360
      },
      "videoId": "z9c5tlQHXWM",
      "publishedAt": "2023-08-11T10:00:09Z"
    },
    {
      "title": "デーモンダンストーキョー Animation Live #Shorts",
      "imageUrl": {
        "url": "https://i.ytimg.com/vi/Uo0e7Aqsrww/hqdefault.jpg",
        "width": 480,
        "height": 360
      },
      "videoId": "Uo0e7Aqsrww",
      "publishedAt": "2023-06-30T11:12:30Z"
    }
  ],
  "statistics": {
    "viewCount": "2305315470",
    "subscriberCount": "4640000",
    "hiddenSubscriberCount": false,
    "videoCount": "93"
  }
}
```

### POST /vocadb/artists

Get the artist's top-rated VOCALOID songs as reported by the VocaDB API.

Request Body
```json
{
  "vocadbUrl": "https://vocadb.net/Ar/53"
}
```

Response - 200 OK
```json
[
  {
    "name": "ローリンガール",
    "aliases": "Rolling Girl, Rollin' Girl, 翻滚少女",
    "artistString": "wowaka feat. 初音ミク",
    "ratingScore": 1370
  },
  {
    "name": "ワールズエンド・ダンスホール",
    "aliases": "World's End Dancehall, 世末舞厅, 世界末日舞厅",
    "artistString": "wowaka feat. 初音ミク, 巡音ルカ",
    "ratingScore": 945
  },
  {
    "name": "アンノウン・マザーグース",
    "aliases": "Unknown Mother-Goose, Unknown Mother Goose, 不为人知的鹅妈妈童谣",
    "artistString": "wowaka, ヒトリエ feat. 初音ミク V4X (Dark)",
    "ratingScore": 741
  },
  {
    "name": "裏表ラバーズ",
    "aliases": "Uraomote Lovers, Two-Sided Lovers, Two-Faced Lovers, 里表情人, Love & Lovers",
    "artistString": "wowaka feat. 初音ミク",
    "ratingScore": 719
  },
  {
    "name": "アンハッピーリフレイン",
    "aliases": "Unhappy Refrain",
    "artistString": "wowaka feat. 初音ミク",
    "ratingScore": 638
  },
  {
    "name": "とおせんぼ",
    "aliases": "Toosenbo, Shall Not Pass, Standing in Your Way, I Won't Let You Through",
    "artistString": "wowaka feat. 初音ミク",
    "ratingScore": 264
  },
  {
    "name": "リバシブルドール",
    "aliases": "Reversible Doll",
    "artistString": "wowaka feat. 初音ミク, 巡音ルカ",
    "ratingScore": 163
  },
  {
    "name": "日常と地球の額縁",
    "aliases": "Nichijou to Chikyuu no Gakubuchi, Usual Life and Earth's Frame, Frame of Normal Life and the World, 日常和地球的画框",
    "artistString": "wowaka feat. 初音ミク",
    "ratingScore": 158
  }
]
```