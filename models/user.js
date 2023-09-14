const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    default: 'Жак-Ив Кусто',
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    default: 'Исследователь',
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    type: String,
    required: false,
    validate: {
      validator: (link) => validator.isURL(link),
      message: 'Неверный URL',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'Пароль не соответствует паттерну',
    },
  },
  password: {
    type: String,
    required: true,
    select: false, // убираем поле пароль при получении списка юзеров
  },
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);
