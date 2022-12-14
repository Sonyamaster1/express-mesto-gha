const express = require('express');

const userRoutes = require('express').Router();

const {
  getUsers,
  createUsers,
  getUserById,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

userRoutes.get('/', getUsers);
userRoutes.get('/:userId', getUserById);
userRoutes.post('/', express.json(), createUsers);
userRoutes.patch('/me', express.json(), updateUser);
userRoutes.patch('/me/avatar', express.json(), updateAvatar);
module.exports = userRoutes;
