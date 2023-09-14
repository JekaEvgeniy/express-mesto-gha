class UserNotFound extends Error {
  constructor(err) {
    super(err);
    this.message = 'Пользователь не найден';
    this.statusCode = 404;
  }
};

class OtherErrors extends Error {
  constructor(err) {
    super(err);
    this.message = err.body;
    this.statusCode = err.statusCode;
  }
};

const errorHandler = (err, req, res, next) => {
  console.log(err);
  let error;

  if (err.statusCode = 404) {
    error = new UserNotFound(err);
  } else {
    error = new OtherErrors(err);
  }

  res.status(err.statusCode).send({ message: error.message });
  next();
};

module.exports = errorHandler;
