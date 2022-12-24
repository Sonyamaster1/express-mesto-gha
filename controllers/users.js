const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const BadRequest = require('../errors/BadRequest'); // 400
const ConflictError = require('../errors/ConflictError'); // 409
const NotFound = require('../errors/NotFound'); // 404
const userSchema = require('../models/user');

// ищем всех пользователей
module.exports.getUsers = (req, res, next) => {
  userSchema
    .find({})
    .then((users) => res.send(users))
    .catch(next);
};
// создаем пользователя
module.exports.createUsers = (req, res, next) => {
  const {
    name, about, avatar, email,
  } = req.body;
  bcrypt.hash(req.body.password, 10).then((hash) => {
    userSchema
      .create({
        name, about, avatar, email, password: hash,
      })
      .then((user) => res.status(201).send(user))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          throw new BadRequest('Переданы некорректные данные при создании пользователя.');
        } else if (err.code === 11000) {
          throw new ConflictError('Пользователь с таким email уже существует');
        }
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
      const token = jwt.sign({ _id: user._id }, 'secret-key', {
        expiresIn: '7d',
      });
      res.send({ token });
    })
    .catch(next);
};
// ищем по ID
module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;
  userSchema
    .findById(userId)
    .orFail(new NotFound('Пользователь по указанному _id не найден'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequest('Переданы некорректные данные');
      }
      if (err.message === 'NotFound') {
        throw new NotFound('Пользователь по указанному _id не найден');
      }
    })
    .catch(next);
};
// обновить данные
module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  userSchema
    .findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    ).orFail(() => {
      throw new NotFound('Пользователь с указанным _id не найден');
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new BadRequest('Переданы некорректные данные при обновлении профиля.');
      }
    })
    .catch(next);
};
// обновление аватара
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  userSchema
    .findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    )
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new BadRequest('Переданы некорректные данные при обновлении профиля.');
      }
    })
    .catch(next);
};
// текущий пользователь
module.exports.getCurrentUser = (res, req, next) => {
  userSchema
    .findById(req.user._id).orFail(() => {
      throw new NotFound('Пользователь не найден');
    })
    .then((user) => res.status(200).send({ user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequest('Переданы некорректные данные');
      } else if (err.message === 'NotFound') {
        throw new NotFound('Пользователь не найден');
      }
    })
    .catch(next);
};
