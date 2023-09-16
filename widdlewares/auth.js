const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  let payload;
  const token = req.cookies.jwt;

  try {
    payload = jwt.verify(token, process.env['JWT_CODE']);
  } catch (err) {
    return res.status(401).send({ message: 'Доступ заблокирован, требуется авторизация.' });
  }

  req.user = payload;
  next();
};

module.exports = auth;
