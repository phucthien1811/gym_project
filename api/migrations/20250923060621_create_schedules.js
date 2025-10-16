// npx knex migrate:make create_schedules
/**
 * @param { import("knex").Knex } knex
 */
exports.up = async function(knex) {
  await knex.schema.createTable('schedules', (t) => {
    t.increments('id').primary();
    t.integer('member_id').unsigned().notNullable()
      .references('id').inTable('members')
      .onUpdate('CASCADE').onDelete('CASCADE');

    t.integer('trainer_id').unsigned().nullable()
      .references('id').inTable('users')
      .onUpdate('CASCADE').onDelete('SET NULL');

    t.integer('workout_id').unsigned().nullable()
      .references('id').inTable('workouts')
      .onUpdate('CASCADE').onDelete('SET NULL');

    // Thời điểm tập (dùng DATETIME cho gọn)
    t.dateTime('scheduled_at').notNullable();

    // Trạng thái buổi tập
    t.enum('status', ['scheduled','completed','canceled']).notNullable().defaultTo('scheduled');

    t.text('note');
    t.timestamps(true, true);

    t.index(['member_id', 'scheduled_at']);
    t.index(['trainer_id', 'scheduled_at']);
    t.index(['status']);
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('schedules');
};
