import knex from '../config/knex.js';
import bcrypt from 'bcryptjs';

const createMemberAccount = async () => {
  try {
    // Hash password
    const hashedPassword = await bcrypt.hash('member123', 10);
    
    // Check if member already exists
    const existingMember = await knex('users').where('email', 'member@gmail.com').first();
    
    if (existingMember) {
      console.log('✅ Member account already exists!');
      console.log('Email: member@gmail.com');
      console.log('Password: member123');
      return;
    }
    
    // Create member account
    const [userId] = await knex('users').insert({
      username: 'member_user',
      email: 'member@gmail.com',
      password: hashedPassword,
      role: 'member',
      full_name: 'Nguyễn Văn A',
      phone: '0987654321',
      created_at: new Date(),
      updated_at: new Date()
    });
    
    console.log('✅ Member account created successfully!');
    console.log('Email: member@gmail.com');
    console.log('Password: member123');
    console.log('User ID:', userId);
    
  } catch (error) {
    console.error('❌ Error creating member account:', error.message);
  } finally {
    process.exit(0);
  }
};

createMemberAccount();