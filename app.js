const express = require('express');
const mongoose = require('mongoose');

const router = require('./routes');

// const bodyParser = require('body-parser');
const app = express();

// подключаемся к серверу mongo
// mongoose.connect('mongodb://localhost:27017/mestodb', { // error err = new ServerSelectionError();
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
	useNewUrlParser: true,
	// useCreateIndex: true,
	// useFindAndModify: false
});


app.use(express.json());

app.use(router);

app.listen(3000, () => {
  console.log('listen port 3000');
});


// 64bdaa123792f85b5dc239fd