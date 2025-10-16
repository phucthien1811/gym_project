/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('orders', function(table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.string('order_number').unique().notNullable();
    table.enum('status', ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']).defaultTo('pending');
    table.decimal('total_amount', 10, 2).notNullable();
    table.decimal('shipping_fee', 10, 2).defaultTo(0);
    table.decimal('discount_amount', 10, 2).defaultTo(0);
    table.json('shipping_address').notNullable();
    table.string('payment_method').notNullable();
    table.enum('payment_status', ['pending', 'paid', 'failed', 'refunded']).defaultTo('pending');
    table.text('notes').nullable();
    table.timestamps(true, true);
    
    // Foreign key
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    
    // Indexes
    table.index('user_id');
    table.index('order_number');
    table.index('status');
    table.index('created_at');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
