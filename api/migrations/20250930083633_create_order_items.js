/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function(knex) {
  return knex.schema.createTable('order_items', function(table) {
    table.increments('id').primary();
    table.integer('order_id').unsigned().notNullable();
    table.string('product_id').notNullable(); // ID từ gymProducts data
    table.string('product_name').notNullable();
    table.string('product_image').nullable();
    table.decimal('unit_price', 10, 2).notNullable();
    table.integer('quantity').notNullable();
    table.decimal('total_price', 10, 2).notNullable();
    table.timestamps(true, true);
    
    // Foreign key
    table.foreign('order_id').references('id').inTable('orders').onDelete('CASCADE');
    
    // Indexes
    table.index('order_id');
    table.index('product_id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function(knex) {
  return knex.schema.dropTable('order_items');
};
