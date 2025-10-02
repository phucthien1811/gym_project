import { db } from './config/database.js';

async function checkPackages() {
  try {
    const [packages] = await db.execute('SELECT * FROM packages');
    console.log('Packages data:');
    packages.forEach(pkg => {
      console.log(`- ${pkg.name}: ${pkg.price} VNĐ (${pkg.duration_days} days) - ${pkg.is_published ? 'Published' : 'Draft'}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    process.exit(0);
  }
}

checkPackages();