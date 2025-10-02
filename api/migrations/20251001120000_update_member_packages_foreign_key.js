/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function(knex) {
  return knex.schema.alterTable('member_packages', function(table) {
    // Drop old foreign key constraint
    table.dropForeign('member_id');
    
    // Rename column from member_id to user_id
    table.renameColumn('member_id', 'user_id');
    
    // Add new foreign key constraint pointing to users table
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function(knex) {
  return knex.schema.alterTable('member_packages', function(table) {
    // Reverse the changes
    table.dropForeign('user_id');
    table.renameColumn('user_id', 'member_id');
    table.foreign('member_id').references('id').inTable('members').onDelete('CASCADE');
  });
};