const router = require('express').Router();
const { codeErrors } = require('../vars/data');
const userRoutes = require('./users');
const createUser = require('./users');
const cardRoutes = require('./cards');

router.post('/singup', createUser);

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);

router.use('*', (req, res) => {
  res.status(codeErrors.notFound).send({
    message: 'Запрашиваемой страницы нет!',
  });
});

module.exports = router;
