const router = require('express').Router();
const { getUsers, getUserById, createUser } = require('../controllers/users');

router.get('/', getUsers); // Пути суммируются /users/users см. внимательно index.js

router.get('/:id', getUserById);

router.post('/', createUser);

module.exports = router;
