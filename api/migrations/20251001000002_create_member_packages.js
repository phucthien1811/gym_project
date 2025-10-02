/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function(knex) {
  return knex.schema.createTable('member_packages', function(table) {
    table.increments('id').primary();
    table.integer('member_id').unsigned().references('id').inTable('members').onDelete('CASCADE');
    table.integer('package_id').unsigned().references('id').inTable('packages').onDelete('CASCADE');
    table.date('start_date').notNullable();
    table.date('end_date').notNullable();
    table.enum('status', ['active', 'expired', 'cancelled']).defaultTo('active');
    table.decimal('paid_amount', 10, 2).notNullable();
    table.text('notes');
    table.timestamps(true, true);
    
    // Indexes
    table.index(['member_id', 'status']);
    table.index('package_id');
    table.index('end_date');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function(knex) {
  return knex.schema.dropTable('member_packages');
};