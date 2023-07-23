const express = require('express');
// const bodyParser = require('body-parser');
const app = express();

const users = [];
let id = 0;

// app.use(bodyParser.json());
app.use(express.json());

app.get('/users', (req, res) => {
  console.log('GET /users');
  res.status(200).send(users);
});

app.get('/users/:id', (req, res) => {
	let { id } = req.params;
	const user = users.find(item => item.id === Number(id));
	if ( user ){
		res.send( user );
	}else {
		res.status(404).send({message: 'User not found'});
	}

});

app.post('/users', (req, res) => {
  console.log('POST /users');

	id += 1;
  const newUser = {
    id,
		...req.body,
  };

  users.push(newUser);

	res.status(201).send(newUser);
});

app.listen(3000, () => {
  console.log('listen port 3000');
});
