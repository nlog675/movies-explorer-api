const router = require('express').Router();
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { MovieValidation } = require('../middlewares/validation');

router.get('/movies', getMovies);
router.post('/movies', MovieValidation, createMovie);
router.delete('/movies/:id', deleteMovie);

module.exports = router;
