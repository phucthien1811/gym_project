/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  const hasTable = await knex.schema.hasTable('class_enrollments');
  if (!hasTable) {
    await knex.schema.createTable('class_enrollments', function(table) {
      table.increments('id').primary();
      table.integer('schedule_id').unsigned().notNullable()
        .references('id').inTable('schedules')
        .onUpdate('CASCADE').onDelete('CASCADE');
      table.integer('user_id').unsigned().notNullable()
        .references('id').inTable('users')
        .onUpdate('CASCADE').onDelete('CASCADE');
      table.enum('status', ['enrolled', 'attended', 'missed', 'cancelled']).defaultTo('enrolled');
      table.timestamp('enrolled_at').defaultTo(knex.fn.now());
      table.timestamp('attended_at').nullable();
      table.text('notes').nullable();
      table.timestamps(true, true);
      
      // Unique constraint: một user chỉ đăng ký một lớp một lần
      table.unique(['schedule_id', 'user_id']);
      table.index(['schedule_id']);
      table.index(['user_id']);
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('class_enrollments');
};