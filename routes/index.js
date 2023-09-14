const router = require('express').Router();
const { codeErrors } = require('../vars/data');
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const { createUser } = require('../controllers/users');
const { login } = require('../controllers/login');
const auth = require('../widdlewares/auth');
const req = require('express/lib/request');

router.post('/signup', createUser);
router.post('/signin', login);

router.use('/users', auth, userRoutes);
router.use('/cards', auth, cardRoutes);

router.use('*', (req, res) => {
  res.status(codeErrors.notFound).send({
    message: 'Запрашиваемой страницы нет!',
  });
});

module.exports = router;
