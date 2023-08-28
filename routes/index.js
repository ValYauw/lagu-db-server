const router = require('express').Router();

const GenreController = require('../controllers/genreController');
const SongController = require('../controllers/songController');
const ArtistController = require('../controllers/artistController');
const AlbumController = require('../controllers/albumController');
const SearchController = require('../controllers/searchController');

// const authentication = require('./middleware/authentication');
// const authorization = require('./middleware/authorization');

router.get('/', (req, res) => {
  res.send('Welcome to the API entrypoint');
});

/* 
 * GET METHODS
 */

// Genres
router.get('/genres', GenreController.getAllGenres);
router.get('/genres/:id/songs', GenreController.getSongsByGenre);
router.get('/genres/:id', GenreController.getGenreAndItsChildren);
// Songs
router.get('/songs', SongController.getSongs);
router.get('/songs/:id', SongController.getSongById);
// Artists
router.get('/artists', ArtistController.getArtists);
router.get('/artists/:id/songs', ArtistController.getArtistSongs);
router.get('/artists/:id/albums', ArtistController.getArtistAlbums);
router.get('/artists/:id', ArtistController.getArtistById);
// Albums
router.get('/albums', AlbumController.getAlbums);
router.get('/albums/:id', AlbumController.getAlbumById);
// Search
router.get('/search/songs', SearchController.searchSongs);
router.get('/search/albums', SearchController.searchAlbums);
router.get('/search/artists', SearchController.searchArtists);

/* 
 * POST METHODS
 */
// router.post('/genres', GenreController.addGenre);
router.post('/songs', SongController.addSong);
router.post('/songs/:id/genres/:genreId', SongController.addSongGenre);
router.post('/songs/:id/playlinks', SongController.addPlayLink);
router.post('/songs/:id/artists/:artistId', SongController.addSongArtist);
router.post('/artists', ArtistController.addArtist);
router.post('/artists/:id/links', ArtistController.addArtistLink);

/* 
 * PUT & PATCH METHODS
 */
// router.put('/genres/:id', GenreController.editGenre);
router.put('/songs/:id', SongController.editSong);
router.put('/songs/:id/playlinks/:playLinkId', SongController.editPlayLinkStatus);
router.put('/songs/:id/artists/:artistId', SongController.editSongArtistRole);
router.put('/artists/:id', ArtistController.editArtist);
// router.put('/artists/:id/links', ArtistController.editArtistLink);

/* 
 * DELETE METHODS
 */
// router.delete('/genres/:id', GenreController.deleteGenre);
router.delete('/songs/:id', SongController.deleteSong);
router.delete('/songs/:id/genres/:genreId', SongController.deleteSongGenre);
router.delete('/songs/:id/playlinks/:playLinkId', SongController.deletePlayLink);
router.delete('/songs/:id/artists/:artistId', SongController.deleteSongArtist);
router.delete('/artists/:id', ArtistController.deleteArtist);
router.delete('/artists/:id/links/:linkId', ArtistController.deleteArtistLink);

module.exports = router;