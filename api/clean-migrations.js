import { db } from './config/database.js';

async function cleanMigrations() {
  try {
    // Xóa các migration records bị corrupt
    const corruptMigrations = [
      '20250930083602_create_orders.js',
      '20250930083633_create_order_items.js'
    ];
    
    for (const migration of corruptMigrations) {
      await db.execute(
        'DELETE FROM knex_migrations WHERE name = ?',
        [migration]
      );
      console.log(`Removed corrupt migration: ${migration}`);
    }
    
    console.log('Migration table cleaned successfully!');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    process.exit(0);
  }
}

cleanMigrations();