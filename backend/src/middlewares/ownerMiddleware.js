const { FORBIDDEN } = require('../utils/errors');

module.exports = async (req, res, next) => {
  try {
    if (req.body.userId === req.user.id) {
      next();
    } else {
      next(FORBIDDEN());
    }
  } catch (e) {
    next(e);
  }
};
