const router = require('express').Router();
const { getMovies, createMovie } = require('../controllers/movies')
const { MovieValidation } = require('../middlewares/validation')

router.get('/movies', getMovies);
router.post('/movies', MovieValidation, createMovie);

module.exports = router;