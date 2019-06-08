const knexConfig = require('../../knexfile');
const knex = require('knex')(knexConfig.development);

const bookshelf = require('bookshelf')(knex);
bookshelf.plugin('registry');
bookshelf.plugin('visibility');
bookshelf.plugin(require('bookshelf-uuid'));

module.exports = bookshelf;
