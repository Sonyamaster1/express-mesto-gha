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
cardRoutes.post('/', createCards, validationCreateCard);
cardRoutes.delete('/:cardId', deleteCard, validationCardById);
cardRoutes.put('/:cardId/likes', getLikes, validationCardById);
cardRoutes.delete('/:cardId/likes', deleteLikes, validationCardById);
module.exports = cardRoutes;
