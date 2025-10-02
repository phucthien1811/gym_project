exports.up = function(knex) {
  return knex.schema.createTable('trainers', function(table) {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('email').unique().notNullable();
    table.string('phone');
    table.text('specialization'); // Chuyên môn
    table.text('bio'); // Tiểu sử
    table.string('avatar_url');
    table.integer('experience_years').defaultTo(0); // Số năm kinh nghiệm
    table.text('certifications'); // Chứng chỉ
    table.decimal('hourly_rate', 10, 2); // Giá theo giờ
    table.enum('status', ['active', 'inactive']).defaultTo('active');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('trainers');
};