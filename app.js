const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./routes');

const app = express();

app.use(bodyParser.json());

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

async function connect() {
  try {
    await mongoose.set('strictQuery', false);
    await mongoose.connect('mongodb://localhost:27017/mestodb');
    console.log(`App connected ${MONGO_URL}`);
    await app.listen(PORT);
    console.log(`App listening on port ${PORT}`);
  } catch (err) {
    console.log(err);
  }
}
app.use((req, res, next) => {
  req.user = {
    _id: '639717c5c9a79c3d523a243e',
  };
  next();
});

// подключаем роуты
app.use(router);
connect();
