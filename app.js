const express = require('express');
// const bodyParser = require('body-parser');
const app = express();
const {	getUsers,	getUserById, createUser } = require('./controllers/users');

app.use(express.json());

app.get('/users', getUsers);

app.get('/users/:id', getUserById);

app.post('/users', createUser);

app.listen(3000, () => {
  console.log('listen port 3000');
});
