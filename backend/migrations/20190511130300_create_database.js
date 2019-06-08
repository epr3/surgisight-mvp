const uuid = require('uuid/v4');
exports.up = function(knex, Promise) {
  return knex.schema.createTable('sessions', table => {
    table
      .uuid('id')
      .primary()
      .defaultTo(uuid());
    table.string('status');
    table.uuid('eventId');
    table.datetime('createdAt');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('sessions');
};
