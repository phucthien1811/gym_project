/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  // Thêm các cột mới cho bảng schedules để biến thành classes
  const hasTable = await knex.schema.hasTable('schedules');
  if (!hasTable) {
    throw new Error('Table schedules does not exist');
  }

  // Kiểm tra và thêm các cột mới
  const hasClassNameColumn = await knex.schema.hasColumn('schedules', 'class_name');
  if (!hasClassNameColumn) {
    await knex.schema.alterTable('schedules', function(table) {
      table.string('class_name').nullable();
      table.text('description').nullable();
      table.integer('max_participants').defaultTo(20);
      table.integer('current_participants').defaultTo(0);
      table.decimal('price', 10, 2).defaultTo(0);
      table.string('room').nullable();
      table.time('start_time').nullable();
      table.time('end_time').nullable();
      table.date('class_date').nullable();
      table.enum('day_of_week', ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']).nullable();
      table.boolean('is_recurring').defaultTo(false);
      table.enum('difficulty_level', ['beginner', 'intermediate', 'advanced']).defaultTo('beginner');
      table.string('location').nullable();
      table.json('equipment_needed').nullable();
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.alterTable('schedules', function(table) {
    table.dropColumn('class_name');
    table.dropColumn('description');
    table.dropColumn('max_participants');
    table.dropColumn('current_participants');
    table.dropColumn('price');
    table.dropColumn('room');
    table.dropColumn('start_time');
    table.dropColumn('end_time');
    table.dropColumn('class_date');
    table.dropColumn('day_of_week');
    table.dropColumn('is_recurring');
    table.dropColumn('difficulty_level');
    table.dropColumn('location');
    table.dropColumn('equipment_needed');
  });
};