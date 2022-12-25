const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const router = require('./routes');
const auth = require('./middlewares/auth');

const app = express();

app.use(bodyParser.json());
const { validationCreateUser, validationLogin } = require('./middlewares/validation');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;
const { createUsers, login } = require('./controllers/auth');

app.post('/signin', validationLogin, login);
app.post('/signup', validationCreateUser, createUsers);
app.use(auth);
app.use(router);
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
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
  next();
});
// подключаем роуты
connect();
