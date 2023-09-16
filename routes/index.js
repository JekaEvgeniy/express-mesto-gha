const router = require('express').Router();
const { codeErrors } = require('../vars/data');
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const { createUser, getCurrentUser, login } = require('../controllers/users');
const auth = require('../widdlewares/auth');

router.post('/signup', createUser);
router.post('/signin', login);

router.use('/users', auth, userRoutes);
router.use('/cards', auth, cardRoutes);
router.use('/me', getCurrentUser);

router.use('*', (req, res) => {
  res.status(codeErrors.notFound).send({
    message: 'Запрашиваемой страницы нет!',
  });
});

module.exports = router;
/*
checklist_14
Удалён хардкод req.user из проектной работы предыдущего спринта.


Все роуты, кроме /signin и /signup , должны быть защищены авторизацией.

401 — передан неверный логин или пароль. Также эту ошибку возвращает авторизационный middleware,
если передан неверный JWT;
403 — попытка удалить чужую карточку;
409 — при регистрации указан email, который уже существует на сервере.

из чата: ошибки вынести в отдельный файл

Поля avatar и link проверяются регулярным выражением. Шаблон находит URL таких форматов:
http://ya.ru
https://www.ya.ru
http://2-domains.ru
http://ya.ru/path/to/deep/
http://ya-ya-ya.ru

*/