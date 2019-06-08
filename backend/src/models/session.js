const bookshelf = require('../config/bookshelf');

module.exports = bookshelf.model('Session', {
  tableName: 'sessions',
  uuid: true
});
