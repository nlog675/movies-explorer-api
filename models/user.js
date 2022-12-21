const mongoose = require('mongoose');
const validator = require('validator');
const { NOT_VALID_EMAIL } = require('../utils/constants');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: NOT_VALID_EMAIL,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
  },
}, {
  versionKey: false,
});

module.exports = mongoose.model('user', userSchema);
