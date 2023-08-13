const Card = require('../models/card');

const getCards = (req, res) => {
// console.log('GET /users');
// console.log(`req.user._id => ${req.user._id}`);
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => res
      .status(500)
      .send({
        message: 'Internal Server Error',
        err: err.message,
        stack: err.stack,
      }));
};

const createCard = (req, res) => {
  Card.create({
    ...req.body,
    owner: req.user._id,
  })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.message.includes('Bad Request')) {
        res.send(400).send({ message: 'Вы ввели некорректные данные' });
      } else {
        res
          .status(500)
          .send({
            message: 'Internal Server Error',
            err: err.message,
            stack: err.stack,
          })
      }
    });
};

module.exports = { getCards, createCard };
