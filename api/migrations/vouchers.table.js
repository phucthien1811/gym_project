/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function(knex) {
  return knex.schema.createTable('vouchers', (table) => {
    table.increments('id').primary();
    table.string('code', 9).notNullable().unique().comment('Mã voucher 9 ký tự');
    table.string('name', 255).notNullable().comment('Tên voucher');
    table.text('description').nullable().comment('Mô tả voucher');
    table.enum('discount_type', ['percentage', 'fixed']).notNullable().defaultTo('percentage').comment('Loại giảm giá: phần trăm hoặc số tiền cố định');
    table.decimal('discount_value', 10, 2).notNullable().comment('Giá trị giảm giá');
    table.decimal('min_order_value', 10, 2).defaultTo(0).comment('Giá trị đơn hàng tối thiểu');
    table.decimal('max_discount', 10, 2).nullable().comment('Giá trị giảm tối đa (cho percentage)');
    table.integer('usage_limit').nullable().comment('Giới hạn số lần sử dụng (null = không giới hạn)');
    table.integer('used_count').defaultTo(0).comment('Số lần đã sử dụng');
    table.datetime('valid_from').notNullable().comment('Ngày bắt đầu hiệu lực');
    table.datetime('valid_until').notNullable().comment('Ngày hết hạn');
    table.boolean('is_active').defaultTo(true).comment('Trạng thái kích hoạt');
    table.integer('created_by').unsigned().notNullable().comment('Admin tạo voucher');
    table.timestamps(true, true);
    
    // Foreign key
    table.foreign('created_by').references('id').inTable('users').onDelete('CASCADE');
    
    // Indexes
    table.index('code');
    table.index('is_active');
    table.index(['valid_from', 'valid_until']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function(knex) {
  return knex.schema.dropTableIfExists('vouchers');
};
