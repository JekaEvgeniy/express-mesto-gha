const login = (req, res) => {
  console.log('POST /login');
  if (!req.body) {
    return res.status(403).send({ message: 'Invalid request body' });
  }

  const { email, password } = req.body;

  if (!email && !password) {
    res.status(400).send({ message: 'Неправильный логин/пароль' }); // 400 ошибка с вебинара.
    return;
  }

  User.findOne({ email })
    .then((user) => {
      // Пользователя нету в базе, хешировать пароль не нужно!
      if (!user) {
        return res.status(401).send({ message: 'Неправильный логин/пароль' });
      }

      bcrypt.compare(String(password), user.password)
        .then((isValidUser) => {
          if (isValidUser) {
            const token = jsonWebToken.sign({
              _id: user._id,
            },
            process.env['JWT_CODE'],
            { expiresIn: 3600 }, // токен будет просрочен через час после создания
            );

            res.send({ token });
          } else {
            res.status(401).send({ message: 'Неправильный логин/пароль' });
          }
        })
    })
    .catch((err) => res
      .status(codeErrors.serverError)
      .send({
        message: 'Ошибка по умолчанию',
        err: err.message,
        stack: err.stack,
      }));
};