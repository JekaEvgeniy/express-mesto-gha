const User = require('../models/user');

const getUsers = (req, res) => {
  // console.log('GET /users');
  // console.log(`req.user._id => ${req.user._id}`);
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => res
      .status(500)
      .send({
        message: 'Internal Server Error',
        err: err.message,
        stack: err.stack,
      }));
};

const getUserById = (req, res) => {
  const textError = 'Not Found';

  User.findById(req.params.id)
    .orFail(() => {
      const error = new Error(textError);
      error.statusCode = 404;
      return error;
    })
    .then((user) => {
      if (user) {
        res.status(200).send(user);
      } else {
        res.status(404).send({ message: 'Нет юзера с таким ID' });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `Ошибка ${err}` });
      } else if (err.name === textError) {
        res.status(404).send({ message: 'Нет юзера с таким ID' });
      } else {
        res.status(500).send({
          message: 'Internal Server Error',
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

const createUser = (req, res) => {
  // console.log('POST /users');

  User.create(req.body)
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Вы ввели некорректные данные' });
      } else {
        res.status(500).send({
          message: 'Internal Server Error',
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

module.exports = { getUsers, getUserById, createUser };
