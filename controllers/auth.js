const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userSchema = require('../models/user');
const BadRequest = require('../errors/BadRequest'); // 400
const ConflictError = require('../errors/ConflictError'); // 409

// создаем пользователя
module.exports.createUsers = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!email || !password) throw new BadRequest('Email или пароль не могут быть пустыми');
  bcrypt.hash(password, 10).then((hash) => {
    userSchema
      .create({
        name, about, avatar, email, password: hash,
      })
      .then(() => res.status(201).send(
        {
          data: {
            name, about, avatar, email,
          },
        },
      ))
      // eslint-disable-next-line consistent-return
      .catch((err) => {
        if (err.code === 11000) {
          return next(new ConflictError('Пользователь с таким email уже существует'));
        }
        if (err.name === 'ValidationError') {
          return next(new BadRequest('Некорректные данные'));
        }
        next(err);
      });
  })
    .catch(next);
};
// проверяем почту и пароль
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return userSchema
    .findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', {
        expiresIn: '7d',
      });
      res.send({ token });
    })
    .catch(next);
};
