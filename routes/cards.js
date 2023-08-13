const router = require('express').Router();
const { getCards, createCard, removeCard, getCardById, likeCard } = require('../controllers/cards');

router.get('/', getCards);
router.get('/:id', getCardById);

router.post('/', createCard);

router.delete('/:cardId', removeCard);

router.put('/:cardId/likes', likeCard);

module.exports = router;
