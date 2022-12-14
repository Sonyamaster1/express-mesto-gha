const cardRoutes = require('express').Router();

const {
  getCards,
  createCards,
  deleteCard,
  getLikes,
  deleteLikes,
} = require('../controllers/cards');

cardRoutes.get('/', getCards);
cardRoutes.post('/', createCards);
cardRoutes.delete('/:cardId', deleteCard);
cardRoutes.put('/:cardId/likes', getLikes);
cardRoutes.delete('/:cardId/likes', deleteLikes);
module.exports = cardRoutes;
