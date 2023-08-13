const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  image: {
    type: String,
    required: true,
    minlength: 5,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});
module.exports = mongoose.model('card', cardSchema);
