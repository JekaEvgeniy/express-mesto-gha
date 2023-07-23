const router = require('express').Router();

const userRoutes = require('./users');
// const cardRoutes = require('./cards');

router.use('/users', userRoutes);
// router.use(cardRoutes);

module.exports = router;