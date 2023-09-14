const router = require('express').Router();
const {
  getUsers, getUserById, createUser, updateUser, updateAvatar, getCurrentUser
} = require('../controllers/users');

router.get('/', getUsers); // Пути суммируются /users/users см. внимательно index.js
router.get('/:id', getUserById);
router.get('/me', getCurrentUser);

router.post('/', createUser);
router.post('/signup', createUser);

router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
