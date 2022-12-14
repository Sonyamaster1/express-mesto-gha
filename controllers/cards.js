const cardSchema = require('../models/card');
// возвращаем все карточки
module.exports.getCards = (req, res) => {
  cardSchema
    .find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => res.status(500).send({ message: err.message }));
};
// создаем карточку
module.exports.createCards = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  cardSchema
    .create({ name, link, owner })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные при создании карточки.',
        });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};
// удаляем карточку
module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  cardSchema
    .findByIdAndRemove(cardId)
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({
          message: 'Карточка с указанным _id не найдена.',
        });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};
// поставить лайк
module.exports.getLikes = (req, res) => {
  cardSchema
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные для постановки лайка.',
        });
      } else if (err.name === 'CastError') {
        res.status(404).send({
          message: 'Передан несуществующий _id карточки.',
        });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};
// убрать лайк
module.exports.deleteLikes = (req, res) => {
  cardSchema
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные для снятия лайка.',
        });
      } else if (err.name === 'CastError') {
        res.status(404).send({
          message: 'Передан несуществующий _id карточки.',
        });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};