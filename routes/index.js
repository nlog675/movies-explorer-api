const router = require('express').Router();
const MovieRouter = require('./movies');
const userRouter = require('./users');
const NotFoundError = require('../utils/NotFoundError');

router.use('/', userRouter);
router.use('/', MovieRouter);
router.use('*', () => {
  throw new NotFoundError('Такой страницы не существует');
});

module.exports = router;
