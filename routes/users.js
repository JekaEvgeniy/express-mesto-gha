const router = require('express').Router();
const { getUsers, getUserById, createUser, updateUser, updateAvatar } = require('../controllers/users');

router.get('/', getUsers); // Пути суммируются /users/users см. внимательно index.js
router.get('/:id', getUserById);

router.post('/', createUser);

router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
