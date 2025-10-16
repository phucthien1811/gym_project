import db from './config/knex.js';

async function checkMembers() {
  try {
    const members = await db('members').select('*');
    console.log('Members in database:', members);
    
    const packages = await db('packages').select('*');
    console.log('Packages in database:', packages);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkMembers();