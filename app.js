const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./routes');
// const auth = require('./middlewares/auth');

const app = express();

app.use(bodyParser.json());
const { validationCreateUser, validationLogin } = require('./middlewares/validation');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;
const { createUsers, login } = require('./controllers/users');

app.post('/signin', login, validationLogin);
app.post('/signup', createUsers, validationCreateUser);
app.use(router);
// app.use(auth);

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

// подключаем роуты
connect();
