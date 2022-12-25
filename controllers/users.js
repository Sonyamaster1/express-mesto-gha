const BadRequest = require('../errors/BadRequest'); // 400
const NotFound = require('../errors/NotFound'); // 404
const userSchema = require('../models/user');

// ищем всех пользователей
module.exports.getUsers = (req, res, next) => {
  userSchema
    .find({})
    .then((users) => res.send(users))
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
    .findById(req.user._id).orFail(() => { // ошибка тут при users/me
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
