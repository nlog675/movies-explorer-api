require('dotenv').config();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../utils/NotFoundError');
const BadRequestError = require('../utils/BadRequestError');
const ConflictError = require('../utils/ConflictError');
const UnauthorizedError = require('../utils/UnauthorizedError');
const { key } = require('../utils/constants');
const {
  ALREADY_EXISTS,
  NOT_FOUND_ID_TEXT,
  BAD_REQUEST_TEXT,
  UNAUTHORIZED_TEXT,
  SUCCESSFUL_AUTH,
  SUCCESSFUL_LOGOUT,
} = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw new NotFoundError(NOT_FOUND_ID_TEXT);
      }
    })
    .catch(next);
};

const updateProfile = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate({ _id: req.user._id }, { name, email }, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFoundError(NOT_FOUND_ID_TEXT);
    })
    .then((updatedUser) => res.send(updatedUser))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError(BAD_REQUEST_TEXT));
      } if (err.code === 11000) {
        return next(new ConflictError(ALREADY_EXISTS));
      }
      return next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => {
      const newUser = user.toObject();
      delete newUser.password;
      return res.status(201).send(newUser);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError(BAD_REQUEST_TEXT));
      }
      if (err.code === 11000) {
        return next(new ConflictError(ALREADY_EXISTS));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError(UNAUTHORIZED_TEXT);
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError(UNAUTHORIZED_TEXT);
          }
          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET : key,
            { expiresIn: '7d' },
          );
          res.cookie('jwt', token, {
            maxAge: 999999999,
            httpOnly: true,
            sameSite: 'None',
            secure: true,
          })
            .send({ email, message: SUCCESSFUL_AUTH });
        });
    })
    .catch(next);
};

const logout = (req, res, next) => {
  res.clearCookie('jwt').send({ message: SUCCESSFUL_LOGOUT })
    .catch(next);
};

module.exports = {
  getUser, updateProfile, createUser, login, logout,
};
