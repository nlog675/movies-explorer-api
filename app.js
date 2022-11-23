const express = require('express');
const mongoose = require('mongoose');
const { PORT = 3001, MONGO_URL = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;

mongoose.connect(MONGO_URL);

const app = express();

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})