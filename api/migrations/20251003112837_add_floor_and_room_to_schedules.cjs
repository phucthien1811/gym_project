/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('schedules', function(table) {
    table.integer('floor').defaultTo(1).comment('Tầng của phòng tập (1-4)');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('schedules', function(table) {
    table.dropColumn('floor');
  });
};
