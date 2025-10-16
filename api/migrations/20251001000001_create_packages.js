/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function(knex) {
  return knex.schema.createTable('packages', function(table) {
    table.increments('id').primary();
    table.string('name', 100).notNullable();
    table.text('description');
    table.decimal('price', 10, 2).notNullable();
    table.integer('duration_days').notNullable(); // Số ngày có hiệu lực
    table.json('features').defaultTo('[]'); // Danh sách tính năng
    table.boolean('is_active').defaultTo(true);
    table.boolean('is_published').defaultTo(false);
    table.integer('sort_order').defaultTo(0);
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function(knex) {
  return knex.schema.dropTable('packages');
};