const router = require('express').Router();
const { getUser, updateProfile } = require('../controllers/users');
const { userValidation } = require('../middlewares/validation');

router.get('/users/me', getUser);
router.patch('/users/me', userValidation, updateProfile);

module.exports = router;
