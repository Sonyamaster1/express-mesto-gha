const cardRoutes = require('express').Router();

const {
  getCards,
  createCards,
  deleteCard,
  getLikes,
  deleteLikes,
} = require('../controllers/cards');

const {
  validationCreateCard,
  validationCardById,
} = require('../middlewares/validation');

cardRoutes.get('/', getCards);
cardRoutes.post('/', validationCreateCard, createCards);
cardRoutes.delete('/:cardId', validationCardById, deleteCard);
cardRoutes.put('/:cardId/likes', validationCardById, getLikes);
cardRoutes.delete('/:cardId/likes', validationCardById, deleteLikes);
module.exports = cardRoutes;
