const bcrypt = require('bcryptjs');
const jsonWebToken = require('jsonwebtoken');
const { codeErrors, codeSuccess } = require('../vars/data');
const User = require('../models/user');

const login = (req, res) => {
  console.log('POST /login');
  if (!req.body) {
    return res.status(403).send({ message: 'Invalid request body' });
  }

  const { email, password } = req.body;

  if (!email && !password) {
    res.status(400).send({ message: 'Неправильный логин/пароль' });
    return;
  }

  User.findOne({ email })
    .select('+password')
    .orFail(() => new Error('Пользователь не найден'))

    .then((user) => {
      if (user) {
        return res.status(409).send({message: 'Такой пользователь уже существует'});
      }

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























// // Если юзера нет, то и пароль проверять бесполезно!
// const checkUser = User.findOne({ email }).select('+password');
// if (! checkUser ) {
//   return res.status(401).send({ message: 'Поля email и password обязательны для заполнения' });
// }

// return User.findUserByCredentials(email, String(password))
//   .then((user) => {
//     // создадим токен
//     const token = jwt.sign(
//       { _id: user._id },
//       process.env['JWT_CODE'],
//       { expiresIn: 3600 * 24 }, // токен будет просрочен через 24 часа после создания
//     );


//     // вернём токен
//     // res.send({ token });
//     res.send({ token });
//   })
//   .catch((err) => {
//     res.status(401).send({ message: 'Неправильный логин/пароль' });
//   });