const router = require('express').Router();
const MovieRouter = require('./movies');
const userRouter = require('./users');
const auth = require('../middlewares/auth');
const NotFoundError = require('../utils/NotFoundError');
const { createUser, login, logout } = require('../controllers/users');
const { loginValidation, registerValidation } = require('../middlewares/validation');
const { PAGE_NOT_FOUND } = require('../utils/constants');

router.post('/signin', loginValidation, login);
router.post('/signup', registerValidation, createUser);
router.use(auth);
router.use('/', userRouter);
router.use('/', MovieRouter);
router.get('/signout', logout);
router.use('*', () => {
  throw new NotFoundError(PAGE_NOT_FOUND);
});

module.exports = router;
