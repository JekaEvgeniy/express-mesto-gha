const router = require('express').Router();
const { getCards, createCard, removeCard, getCardById, likeCard, dislikeCard } = require('../controllers/cards');

router.get('/', getCards);
router.get('/:id', getCardById);

router.post('/', createCard);

router.delete('/:cardId', removeCard);

router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
