const router = require('express').Router();
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { MovieValidation, MovieIdValidation } = require('../middlewares/validation');

router.get('/movies', getMovies);
router.post('/movies', MovieValidation, createMovie);
router.delete('/movies/:_id', MovieIdValidation, deleteMovie);

module.exports = router;
