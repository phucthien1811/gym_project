/**
 * @param { import("knex").Knex } knex
 */
exports.up = async function(knex) {
  await knex.schema.createTable('users', (t) => {
    t.increments('id').primary();
    t.string('email').notNullable().unique();
    t.string('name').notNullable();
    t.string('password_hash').notNullable();
    t.enum('role', ['admin','trainer','member']).defaultTo('member');
    t.timestamps(true, true);
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('users');
};