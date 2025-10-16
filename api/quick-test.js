// Test trực tiếp API packages
import fetch from 'node-fetch';

const testAPI = async () => {
  try {
    console.log('Testing GET /api/packages/public...');
    const response = await fetch('http://localhost:4000/api/packages/public');
    const data = await response.json();
    
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('Error:', error.message);
  }
};

testAPI();