const userRoutes = require('express').Router();

const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getCurrentUser,
} = require('../controllers/users');

const {
  validationUpdateUser,
  validationUpdateAvatar,
  validationUserId,
} = require('../middlewares/validation');

userRoutes.get('/', getUsers);
userRoutes.get('/me', getCurrentUser);
userRoutes.get('/:userId', getUserById, validationUserId);
userRoutes.patch('/me', updateUser, validationUpdateUser);
userRoutes.patch('/me/avatar', updateAvatar, validationUpdateAvatar);
module.exports = userRoutes;
