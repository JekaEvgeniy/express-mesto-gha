const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startWish('Bearer ')) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, process.env['JWT_CODE']);
  } catch (err) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  res.cookie('jwt', token);

  req.user = payload;
  next();
};

module.exports = auth;
