const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { codeErrors, codeSuccess } = require('../vars/data');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const User = require('../models/user');

const login = (req, res) => {
  // console.log('POST /login');
  if (!req.body) {
    return res.status(403).send({ message: 'Invalid request body' });
  }

  const { email, password } = req.body;

  if (!email && !password) {
    // return res.status(400).send({ message: 'Поля email и password обязательны для заполнения' });
    throw new BadRequestError('Поля email и password обязательны для заполнения');
  }

  User.findOne({ email })
    .select('+password')
    .orFail(() => new Error('Пользователь не найден'))

    .then((user) => {
      bcrypt.compare(String(password), user.password)
        .then((isValidUser) => {
          if (isValidUser) {
            const token = jwt.sign(
              { _id: user._id },
              process.env['JWT_CODE'],
              { expiresIn: '1d' },
            );

            res.cookie('jwt', token, {
              maxAge: 360000 * 24 * 1,
              httpOnly: true,
              sameSite: true,
            }).send(user);
          } else {
            // С throw Postman Не вываливает сообщение о ошибках. >>> Could not get response
            // throw new ForbiddenError('Неправильный логин/пароль');

            res.status(403).send({ message: 'Неправильный логин/пароль' });
          }
        });
    })
    .catch((err) => res
      .status(codeErrors.serverError)
      .send({
        message: 'Ошибка по умолчанию',
        err: err.message,
        stack: err.stack,
      }));
};

const createUser = (req, res) => {
  // console.log('POST /signup >>> users.js > createUser');

  if (!req.body) {
    return res.status(400).send({ message: 'Переданы некорректные данные' });
  }

  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!email && !password) {
    return res.status(400).send({ message: 'Поля email и password обязательны для заполнения' });
  }

  User.findOne({ email })
    .then((user) => {
      if (user) {
        return res.status(409).send({ message: 'Такой пользователь уже существует. Введите другой email' });
      }

      bcrypt.hash(String(req.body.password), 10)
        .then((hash) => {
          User.create({
            name, about, avatar, email, password: hash,
          })
            .then((user) => {
              res.status(codeSuccess.created).send({
                data: {
                  name, about, avatar, email,
                },
              });
            })
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
  // console.log('GET /users');
  // console.log(111, req.user);//{ _id: '650323047e49e29bf8466e52', iat: 1694712469 }

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
