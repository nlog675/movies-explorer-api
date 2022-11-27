const mongoose = require('mongoose');
const Movie = require('../models/movie');
const BadRequestError = require('../utils/BadRequestError');
const NotFoundError = require('../utils/NotFoundError');
const ForbiddenError = require('../utils/ForbiddenError');
const {
  BAD_REQUEST_TEXT,
  NOT_ALLOWED_TEXT,
  NOT_FOUND_ID_TEXT,
  DELETED_MESSAGE,
} = require('../utils/constants');

const getMovies = (req, res, next) => Movie.find({})
  .then((movies) => {
    res.status(200).send(movies);
  })
  .catch((err) => next(err));

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => {
      res.send(movie);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError(BAD_REQUEST_TEXT));
      }
      return next(err);
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(NOT_FOUND_ID_TEXT);
      }
      if (movie.owner.toHexString() !== req.user._id) {
        throw new ForbiddenError(NOT_ALLOWED_TEXT);
      }
      Movie.findByIdAndRemove(req.params._id)
        .then((removingMovie) => res.send({ removingMovie, message: DELETED_MESSAGE }));
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError(BAD_REQUEST_TEXT));
      }
      return next(err);
    });
};

module.exports = {
  getMovies, createMovie, deleteMovie,
};
