
const users = [];
let id = 0;

const getUsers = (req, res) => {
	console.log('GET /users');
	res.status(200).send(users);
};

const getUserById = (req, res) => {
	let { id } = req.params;
	const user = users.find(item => item.id === Number(id));
	if (user) {
		res.send(user);
	} else {
		res.status(404).send({ message: 'User not found' });
	}

};


const createUser = (req, res) => {
	console.log('POST /users');

	id += 1;
	const newUser = {
		id,
		...req.body,
	};

	users.push(newUser);

	res.status(201).send(newUser);
};

module.exports = {
	getUsers,
	getUserById,
	createUser
}