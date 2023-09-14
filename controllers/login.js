const bcrypt = require('bcryptjs');
const jsonWebToken = require('jsonwebtoken');
const { codeErrors, codeSuccess } = require('../vars/data');
const User = require('../models/user');

const login = (req, res) => {
  console.log('POST /login');
  const { email, password } = req.body;

  if (!email && !password) {
    res.status(403).send({ message: 'Неправильный логин/пароль' });
    return;
  }

  User.findOne({ email })
    .select('+password')
    .orFail(() => new Error('Пользователь не найден'))

    .then((user) => {
      bcrypt.compare(String(password), user.password)
        .then((isValidUser) => {
          if (isValidUser) {
            const jwt = jsonWebToken.sign({
              _id: user._id,
            }, process.env['JWT_CODE']);

            res.cookie('jwt', jwt, {
              maxAge: 360000,
              httpOnly: true,
              sameSite: true,
            });

            res.send({ data: user.toJSON() });
          } else {
            res.status(403).send({ message: 'Неправильный логин/пароль' });
          }
        })
    })
    .catch((err) => res
      .status(codeErrors.serverError)
      .send({
        message: 'Ошибка по умолчанию',
        err: err.message,
        stack: err.stack,
      }));
};

module.exports = {
  login,
};
