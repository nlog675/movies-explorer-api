require('dotenv').config();
const token = require('jsonwebtoken');
const UnauthorizedError = require('../utils/UnauthorizedError');
const { key } = require('../utils/constants');
const {
  NEEDS_AUTH,
} = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { jwt } = req.cookies;
  if (!jwt) {
    return next(new UnauthorizedError(NEEDS_AUTH));
  }
  let payload;

  try {
    payload = token.verify(jwt, NODE_ENV === 'production' ? JWT_SECRET : key);
  } catch (err) {
    return next(new UnauthorizedError(NEEDS_AUTH));
  }
  req.user = payload;
  return next();
};
