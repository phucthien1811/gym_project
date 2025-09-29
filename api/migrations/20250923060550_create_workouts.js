// npx knex migrate:make create_workouts
/**
 * @param { import("knex").Knex } knex
 */
exports.up = async function(knex) {
  await knex.schema.createTable('workouts', (t) => {
    t.increments('id').primary();
    t.string('name').notNullable();
    t.text('description');
    t.integer('duration_min').unsigned().notNullable().defaultTo(60);
    // trainer_id tham chiếu users.id (role = 'trainer')
    t.integer('trainer_id').unsigned()
      .references('id').inTable('users')
      .onUpdate('CASCADE').onDelete('SET NULL')
      .nullable();
    t.boolean('active').notNullable().defaultTo(true);
    t.timestamps(true, true);
    t.index(['trainer_id', 'active']);
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('workouts');
};
