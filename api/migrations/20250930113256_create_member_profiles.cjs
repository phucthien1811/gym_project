/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('member_profiles', function(table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    
    // Personal Information
    table.string('phone', 20);
    table.date('birth_date');
    table.enum('gender', ['male', 'female', 'other']);
    table.text('address');
    table.string('avatar_url');
    
    // Physical Information
    table.decimal('height', 5, 2); // cm (e.g., 175.50)
    table.decimal('weight', 5, 2); // kg (e.g., 70.50)
    table.decimal('bmi', 4, 2); // calculated BMI
    
    // Fitness Goals
    table.text('fitness_goals');
    table.enum('activity_level', ['sedentary', 'light', 'moderate', 'active', 'very_active']).defaultTo('moderate');
    
    // Emergency Contact
    table.string('emergency_contact_name');
    table.string('emergency_contact_phone', 20);
    table.string('emergency_contact_relationship');
    
    // Membership Info (will be updated from membership table)
    table.string('membership_status').defaultTo('inactive'); // active, inactive, expired
    table.date('membership_start_date');
    table.date('membership_end_date');
    table.string('membership_type'); // basic, premium, vip
    
    // Medical Information
    table.text('medical_conditions');
    table.text('allergies');
    
    table.timestamps(true, true);
    
    // Unique constraint - one profile per user
    table.unique('user_id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('member_profiles');
};
