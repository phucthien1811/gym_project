import db from './config/knex.js';

async function fixMemberPackagesSchema() {
  try {
    // Drop foreign key constraint
    await db.raw('ALTER TABLE member_packages DROP FOREIGN KEY member_packages_member_id_foreign');
    
    // Rename column
    await db.raw('ALTER TABLE member_packages CHANGE member_id user_id INT UNSIGNED NOT NULL');
    
    // Add new foreign key constraint
    await db.raw('ALTER TABLE member_packages ADD CONSTRAINT member_packages_user_id_foreign FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE');
    
    console.log('Successfully updated member_packages schema to reference users table');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixMemberPackagesSchema();