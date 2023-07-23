const express = require('express');

const router = require('./routes');

// const bodyParser = require('body-parser');
const app = express();

app.use(express.json());

app.use(router);

app.listen(3000, () => {
  console.log('listen port 3000');
});
