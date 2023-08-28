const router = require('express').Router();

const LoginController = require('../controllers/loginController');
const GenreController = require('../controllers/genreController');
const SongController = require('../controllers/songController');
const ArtistController = require('../controllers/artistController');
const AlbumController = require('../controllers/albumController');
const SearchController = require('../controllers/searchController');

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

router.use(authentication);

/* 
 * POST METHODS
 */
// router.post('/genres', authorizeStaff, GenreController.addGenre);
router.post('/songs', authorizeStaff, SongController.addSong);
router.post('/songs/:id/genres/:genreId', authorizeStaff, SongController.addSongGenre);
router.post('/songs/:id/playlinks', authorizeStaff, SongController.addPlayLink);
router.post('/songs/:id/artists/:artistId', authorizeStaff, SongController.addSongArtist);
router.post('/artists', authorizeStaff, ArtistController.addArtist);
router.post('/artists/:id/links', authorizeStaff, ArtistController.addArtistLink);

/* 
 * PUT & PATCH METHODS
 */
// router.put('/genres/:id', GenreController.editGenre);
router.put('/songs/:id', authorizeStaff, SongController.editSong);
router.put('/songs/:id/playlinks/:playLinkId', authorizeStaff, SongController.editPlayLinkStatus);
router.put('/songs/:id/artists/:artistId', authorizeStaff, SongController.editSongArtistRole);
router.put('/artists/:id', authorizeStaff, ArtistController.editArtist);
// router.put('/artists/:id/links', authorizeStaff, ArtistController.editArtistLink);

/* 
 * DELETE METHODS
 */
// router.delete('/genres/:id', GenreController.deleteGenre);
router.delete('/songs/:id', authorizeAdmin, SongController.deleteSong);
router.delete('/songs/:id/genres/:genreId', authorizeAdmin, SongController.deleteSongGenre);
router.delete('/songs/:id/playlinks/:playLinkId', authorizeAdmin, SongController.deletePlayLink);
router.delete('/songs/:id/artists/:artistId', authorizeAdmin, SongController.deleteSongArtist);
router.delete('/artists/:id', authorizeAdmin, ArtistController.deleteArtist);
router.delete('/artists/:id/links/:linkId', authorizeAdmin, ArtistController.deleteArtistLink);

module.exports = router;