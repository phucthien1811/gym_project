import db from './config/knex.js';

async function createMemberRecord() {
  try {
    // Tạo member record với user_id = 5 (user hiện tại)
    await db('members').insert({
      id: 5, // Same ID as user
      user_id: 5,
      phone: '0123456789',
      joined_at: new Date(),
      created_at: new Date(),
      updated_at: new Date()
    });
    
    console.log('Member record created for user ID 5');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createMemberRecord();