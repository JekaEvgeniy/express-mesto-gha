const { codeErrors, codeSuccess } = require('../vars/data');
const User = require('../models/user');

const getUsers = (req, res) => {
  // console.log('GET /users');

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
        res.status(codeErrors.notFound).send({ message: 'Пользователь с указанным _id не найден.' });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(codeErrors.badRequest).send({ message: `Ошибка ${err}. Переданы некорректные данные` });
      } else {
        res.status(codeErrors.serverError).send({
          message: `Ошибка ${err}. по умолчанию`,
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

const createUser = (req, res) => {
  // console.log('POST /users');

  User.create(req.body)
    .then((user) => res.status(codeSuccess.created).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(codeErrors.badRequest).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(codeErrors.serverError).send({
          message: 'Ошибка по умолчанию',
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
  getUsers, getUserById, createUser, updateUser, updateAvatar,
};
