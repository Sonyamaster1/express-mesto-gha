const cardSchema = require('../models/card');
const NotFound = require('../errors/NotFound'); // 404
const CurrentErr = require('../errors/CurrentErr'); // 403
const BadRequest = require('../errors/BadRequest'); // 400
// возвращаем все карточки
module.exports.getCards = (req, res, next) => {
  cardSchema
    .find({})
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};
// создаем карточку
module.exports.createCards = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  cardSchema
    .create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest('Переданы некорректные данные при создании карточки');
      }
    })
    .catch(next);
};
// удаляем карточку
module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  return cardSchema.findById(cardId)
    .orFail(() => {
      throw new NotFound('Карточка с указанным _id не найдена');
    })
    .then((card) => {
      if (!card.owner.equals(req.user._id)) { // ошибка тут при удалении карточки
        return next(new CurrentErr('Вы не можете удалить чужую карточку'));
      }
      return card.remove().then(() => res.send({ message: 'Карточка успешно удалена' }));
    })
    .catch(next);
};
// поставить лайк
module.exports.getLikes = (req, res, next) => {
  cardSchema
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    ).orFail(() => {
      throw new NotFound('Передан несуществующий _id карточки');
    })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequest('Переданы некорректные данные для постановки лайка');
      }
      if (err.message === 'NotFound') {
        throw new NotFound('Передан несуществующий _id карточки');
      }
    })
    .catch(next);
};
// убрать лайк
module.exports.deleteLikes = (req, res, next) => {
  cardSchema
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    ).orFail(() => {
      throw new NotFound('Передан несуществующий _id карточки');
    })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequest('Переданы некорректные данные для снятия лайка');
      }
      if (err.message === 'NotFound') {
        throw new NotFound('Передан несуществующий _id карточки');
      }
    })
    .catch(next);
};
