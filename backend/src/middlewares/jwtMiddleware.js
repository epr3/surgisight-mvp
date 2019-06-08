const { verify } = require('jsonwebtoken');
const { UNAUTHORIZED } = require('../utils/errors');

module.exports = async (req, res, next) => {
  try {
    const auth = req.header('Authorization').split('Bearer ')[1];
    const jwt = verify(auth, process.env.JWT_SECRET);
    req.user = { ...jwt.context };
    next();
  } catch (e) {
    next(UNAUTHORIZED());
  }
};
