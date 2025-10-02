import { db } from './config/database.js';

async function checkTables() {
  try {
    const [tables] = await db.execute('SHOW TABLES');
    console.log('Existing tables:');
    tables.forEach(table => {
      console.log(' -', Object.values(table)[0]);
    });
    
    // Kiểm tra migration table
    const [migrations] = await db.execute('SELECT * FROM knex_migrations ORDER BY id');
    console.log('\nCompleted migrations:');
    migrations.forEach(migration => {
      console.log(' -', migration.name);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    process.exit(0);
  }
}

checkTables();