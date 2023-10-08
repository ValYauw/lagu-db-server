const router = require('express').Router();

const LoginController = require('../controllers/loginController');
const GenreController = require('../controllers/genreController');
const SongController = require('../controllers/songController');
const ArtistController = require('../controllers/artistController');
const AlbumController = require('../controllers/albumController');
const SearchController = require('../controllers/searchController');
const ExtLibraryController = require('../controllers/extLibraryController');

const authentication = require('../middleware/authentication');
const { authorizeAdmin, authorizeStaff } = require('../middleware/authorization');

router.get('/', (req, res) => {
  res.send('Welcome to the API entrypoint');
});

router.post('/login', LoginController.login);
router.post('/glogin', LoginController.glogin);
router.post('/register', LoginController.register);

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

// API
router.post('/youtube/artists', ExtLibraryController.getArtistYouTubeData);
router.post('/vocadb/artists', ExtLibraryController.getPopularSongsFromVocaDB);

router.use(authentication);

/* 
 * POST METHODS
 */
// router.post('/genres', authorizeStaff, GenreController.addGenre);
router.post('/songs', authorizeStaff, SongController.addSong);
router.post('/artists', authorizeStaff, ArtistController.addArtist);

/* 
 * PUT & PATCH METHODS
 */
// router.put('/genres/:id', GenreController.editGenre);
router.put('/songs/:id', authorizeStaff, SongController.editSong);
router.put('/artists/:id', authorizeStaff, ArtistController.editArtist);

/* 
 * DELETE METHODS
 */
// router.delete('/genres/:id', GenreController.deleteGenre);
router.delete('/songs/:id', authorizeAdmin, SongController.deleteSong);
router.delete('/artists/:id', authorizeAdmin, ArtistController.deleteArtist);

module.exports = router;