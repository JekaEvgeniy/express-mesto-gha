const router = require('express').Router();
const { getCards, createCard, removeCard, getCardById } = require('../controllers/cards');

router.get('/', getCards);
router.get('/:id', getCardById);

router.post('/', createCard);

router.delete('/:cardId', removeCard);

module.exports = router;
