/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  // Thêm cột trainer_id nếu chưa có
  const hasTrainerColumn = await knex.schema.hasColumn('schedules', 'trainer_id');
  if (!hasTrainerColumn) {
    await knex.schema.alterTable('schedules', function(table) {
      table.integer('trainer_id').unsigned().nullable();
      table.foreign('trainer_id').references('id').inTable('users').onUpdate('CASCADE').onDelete('SET NULL');
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.alterTable('schedules', function(table) {
    table.dropForeign('trainer_id');
    table.dropColumn('trainer_id');
  });
};