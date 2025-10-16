/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function(knex) {
  return knex.schema.createTable('invoices', function(table) {
    table.increments('id').primary();
    table.string('invoice_number', 50).notNullable().unique();
    
    // Nguồn tạo hóa đơn: 'manual' (quầy), 'gym_package' (gói tập), 'shop_order' (đơn hàng)
    table.enum('source_type', ['manual', 'gym_package', 'shop_order']).notNullable();
    table.integer('source_id').unsigned().nullable(); // ID của order/package nếu tự động
    
    // Thông tin khách hàng
    table.integer('user_id').unsigned().notNullable();
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.string('customer_name', 100).notNullable();
    table.string('customer_email', 100).nullable();
    table.string('customer_phone', 20).nullable();
    
    // Chi tiết sản phẩm/dịch vụ
    table.string('item_name', 255).notNullable();
    table.text('description').nullable();
    table.integer('quantity').unsigned().notNullable().defaultTo(1);
    table.decimal('unit_price', 15, 2).notNullable();
    table.decimal('total_amount', 15, 2).notNullable();
    
    // Thông tin thanh toán
    table.enum('payment_method', ['cash', 'banking', 'card', 'momo', 'vnpay']).notNullable();
    table.enum('payment_status', ['pending', 'paid', 'failed', 'refunded']).notNullable().defaultTo('pending');
    table.decimal('amount_paid', 15, 2).notNullable().defaultTo(0);
    table.decimal('change_amount', 15, 2).notNullable().defaultTo(0);
    table.timestamp('paid_at').nullable();
    
    // Metadata
    table.integer('created_by').unsigned().nullable(); // Admin tạo hóa đơn quầy
    table.foreign('created_by').references('id').inTable('users').onDelete('SET NULL');
    table.integer('confirmed_by').unsigned().nullable(); // Admin xác nhận thanh toán
    table.foreign('confirmed_by').references('id').inTable('users').onDelete('SET NULL');
    
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function(knex) {
  return knex.schema.dropTableIfExists('invoices');
};
