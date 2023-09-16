const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { codeErrors, codeSuccess } = require('../vars/data');
const User = require('../models/user');

const login = (req, res) => {
  console.log('POST /login');
  if (!req.body) {
    return res.status(403).send({ message: 'Invalid request body' });
  }

  const { email, password } = req.body;

  if (!email && !password) {
    return res.status(400).send({ message: 'Поля email и password обязательны для заполнения' });
  }

  // Если юзера нет, то и пароль проверять бесполезно!
  const checkUser = User.findOne({ email });
  if (! checkUser ) {
    return res.status(401).send({ message: 'Поля email и password обязательны для заполнения' });
  }

  return User.findUserByCredentials(email, String(password))
    .then((user) => {
      // создадим токен
      const token = jwt.sign(
        { _id: user._id },
        process.env['JWT_CODE'],
        { expiresIn: 3600 }, // токен будет просрочен через час после создания
      );
      // console.log(token);

      // вернём токен
      res.send({ token });
    })
    .catch((err) => {
      res.status(401).send({ message: 'Неправильный логин/пароль' });
    });
};

const createUser = (req, res) => {
  console.log('POST /signup >>> users.js > createUser');

  if (!req.body) {
    return res.status(400).send({ message: 'Переданы некорректные данные' });
  }

  const { email, password } = req.body;
  if (!email && !password) {
    return res.status(400).send({ message: 'Поля email и password обязательны для заполнения' });
  }

  User.findOne({ email })
    .then((user) => {
      if (user) {
        return res.status(400).send({ message: 'Такой пользователь уже существует. Введите другой email' });
      }

      bcrypt.hash(String(req.body.password), 10)
        .then((hash) => {
          User.create({
            ...req.body, password: hash,
          })
            .then((user) => res.status(codeSuccess.created).send({ data: user }))
            .catch((err) => {
              if (err.name === 'ValidationError') {
                res.status(codeErrors.badRequest).send({ message: 'Переданы некорректные данные' });
              } else if (err.code === 11000) {
                res.status(codeErrors.badRequest).send({ message: 'Пользователь с таким email уже существует' });
              } else {
                res.status(codeErrors.serverError).send({
                  message: 'Ошибка по умолчанию',
                  err: err.message,
                  stack: err.stack,
                });
              }
            });
        });
    });
};

const getUsers = (req, res) => {
  console.log('GET /users');
  console.log(111, req.user);//{ _id: '650323047e49e29bf8466e52', iat: 1694712469 }

  User.find({})
    .then((users) => res.status(codeSuccess.ok).send(users))
    .catch((err) => res
      .status(codeErrors.serverError)
      .send({
        message: 'Ошибка по умолчанию',
        err: err.message,
        stack: err.stack,
      }));
};

const getCurrentUser = (req, res) => {
  const textError = 'Not Found';

  console.log(req.user._id);

  User.findById(req.user._id)
    .orFail(() => {
      const error = new Error(textError);
      error.statusCode = codeErrors.notFound;
      return error;
    })
    .then((user) => {
      if (user) {
        res.status(codeSuccess.ok).send(user);
      } else {
        res.status(codeErrors.notFound).send({ message: 'Ошибка ... ... ...' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(codeErrors.badRequest).send({ message: 'Переданы некорректные данные' });
      } else if (err.statusCode === codeErrors.notFound) {
        res.status(codeErrors.notFound).send({ message: 'Пользователь с указанным _id не найден' });
      } else {
        res.status(codeErrors.serverError).send({
          message: `Ошибка ${err}. по умолчанию`,
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

const getUserById = (req, res) => {
  const textError = 'Not Found';

  User.findById(req.params.id)
    .orFail(() => {
      const error = new Error(textError);
      error.statusCode = codeErrors.notFound;
      return error;
    })
    .then((user) => {
      if (user) {
        res.status(codeSuccess.ok).send(user);
      } else {
        res.status(codeErrors.notFound).send({ message: 'Пользователь с указанным _id не найден' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(codeErrors.badRequest).send({ message: 'Переданы некорректные данные' });
      } else if (err.statusCode === codeErrors.notFound) {
        res.status(codeErrors.notFound).send({ message: 'Пользователь с указанным _id не найден' });
      } else {
        res.status(codeErrors.serverError).send({
          message: `Ошибка ${err}. по умолчанию`,
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) {
        res.status(codeSuccess.ok).send(user);
      } else {
        res.status(codeErrors.notFound).send({
          message: 'Пользователь с указанным _id не найден',
        });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(codeErrors.badRequest).send({
          message: 'Переданы некорректные данные при обновлении профиля',
        });
      } else {
        res.status(codeErrors.serverError).send({
          message: 'Ошибка по умолчанию',
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) {
        res.status(codeSuccess.ok).send(user);
      } else {
        res.status(codeErrors.notFound).send({ message: 'Пользователь с указанным _id не найден' });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(codeErrors.badRequest).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      } else {
        res.status(codeErrors.serverError).send({
          message: 'Ошибка по умолчанию',
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

module.exports = {
  login, getUsers, getCurrentUser, getUserById, createUser, updateUser, updateAvatar,
};
