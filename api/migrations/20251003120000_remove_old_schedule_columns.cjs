/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  // Xóa foreign key và cột member_id khỏi schedules
  const hasColumn = await knex.schema.hasColumn('schedules', 'member_id');
  if (hasColumn) {
    await knex.schema.alterTable('schedules', function(table) {
      table.dropForeign('member_id');
      table.dropColumn('member_id');
    });
  }
  
  // Xóa cột workout_id nếu có
  const hasWorkoutColumn = await knex.schema.hasColumn('schedules', 'workout_id');
  if (hasWorkoutColumn) {
    await knex.schema.alterTable('schedules', function(table) {
      table.dropForeign('workout_id');
      table.dropColumn('workout_id');
    });
  }
  
  // Xóa cột scheduled_at nếu có
  const hasScheduledAtColumn = await knex.schema.hasColumn('schedules', 'scheduled_at');
  if (hasScheduledAtColumn) {
    await knex.schema.alterTable('schedules', function(table) {
      table.dropColumn('scheduled_at');
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.alterTable('schedules', function(table) {
    table.integer('member_id').unsigned().nullable();
    table.integer('workout_id').unsigned().nullable();
    table.dateTime('scheduled_at').nullable();
  });
};