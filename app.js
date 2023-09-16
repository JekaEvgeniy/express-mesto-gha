require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate'); // https://www.npmjs.com/package/celebrate

const router = require('./routes');
const cookies = require('cookie-parser');
const errorHandler = require('./widdlewares/error');

// const bodyParser = require('body-parser');
const app = express();

// подключаемся к серверу mongo

const { PORT = 3000, DATA_BASE = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

mongoose.connect(DATA_BASE, {
  useNewUrlParser: true,
});

app.use(express.json());
app.use(cookies());

app.use(router);

app.use(errors()); // for celebrate

app.use(errorHandler);

app.listen(PORT, () => {
  console.log('listen port 3000');
});
