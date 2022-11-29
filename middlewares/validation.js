const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const { NOT_VALID_LINK } = require('../utils/constants');

const isUrlValid = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.message(NOT_VALID_LINK);
};

const userValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

const MovieValidation = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required().min(2).max(4),
    description: Joi.string().required(),
    image: Joi.string().required().custom(isUrlValid),
    trailerLink: Joi.string().required().custom(isUrlValid),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().custom(isUrlValid),
    movieId: Joi.number().required(),
  }),
});

const MovieIdValidation = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().hex().length(24),
  }),
});

const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const registerValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
});

module.exports = {
  userValidation,
  MovieValidation,
  MovieIdValidation,
  loginValidation,
  registerValidation,
};
