import { db } from './config/database.js';

async function fixMigrations() {
  try {
    // Đánh dấu các migration duplicate như đã hoàn thành
    const duplicates = [
      '20250930083602_create_orders.js',
      '20250930083633_create_order_items.js', 
      '20250930113256_create_member_profiles.cjs'
    ];
    
    for (const migration of duplicates) {
      // Kiểm tra xem đã tồn tại chưa
      const [existing] = await db.execute(
        'SELECT * FROM knex_migrations WHERE name = ?', 
        [migration]
      );
      
      if (existing.length === 0) {
        await db.execute(
          'INSERT INTO knex_migrations (name, batch, migration_time) VALUES (?, 2, NOW())',
          [migration]
        );
        console.log(`Added migration: ${migration}`);
      } else {
        console.log(`Migration already exists: ${migration}`);
      }
    }
    
    console.log('Migration table updated successfully!');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    process.exit(0);
  }
}

fixMigrations();