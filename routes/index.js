const express = require('express');

const router = require('express').Router();
const auth = require('../middlewares/auth');

const usersRouter = require('./users');
const cardsRouter = require('./cards');
const NotFound = require('../errors/NotFound');

router.use('/users', auth, usersRouter);
router.use('/cards', cardsRouter);
router.use((req, res, next) => {
  next(new NotFound('Такая страница не существует'));
});
router.use(express.json());

module.exports = router;
