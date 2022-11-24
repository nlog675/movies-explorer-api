const router = require('express').Router();
const MovieRouter = require('./movies');
const userRouter = require('./users');
const NotFoundError = require('../utils/NotFoundError');
const { createUser, login } = require('../controllers/users');
const { loginValidation, registerValidation } = require('../middlewares/validation');

router.post('/signin', loginValidation, login);
router.post('/signup', registerValidation, createUser);
router.use('/', userRouter);
router.use('/', MovieRouter);
router.get('/signout', logout);
router.use('*', () => {
  throw new NotFoundError('Такой страницы не существует');
});

module.exports = router;
