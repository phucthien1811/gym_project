import fetch from 'node-fetch';

const API_BASE = 'http://localhost:4000/api';

async function testPackagesAPI() {
  try {
    console.log('Testing Package APIs...\n');
    
    // Test 1: Get public packages
    console.log('1. Testing GET /packages/public');
    const publicResponse = await fetch(`${API_BASE}/packages/public`);
    const publicData = await publicResponse.json();
    console.log('Status:', publicResponse.status);
    console.log('Response:', JSON.stringify(publicData, null, 2));
    console.log('---\n');
    
    // Test 2: Get all packages (admin - giả sử có token)
    console.log('2. Testing GET /packages (admin)');
    const adminResponse = await fetch(`${API_BASE}/packages`, {
      headers: {
        'Authorization': 'Bearer fake-admin-token' // Sẽ cần token thật
      }
    });
    const adminData = await adminResponse.json();
    console.log('Status:', adminResponse.status);
    console.log('Response:', JSON.stringify(adminData, null, 2));
    console.log('---\n');
    
    // Test 3: Get package by ID
    console.log('3. Testing GET /packages/1');
    const singleResponse = await fetch(`${API_BASE}/packages/1`);
    const singleData = await singleResponse.json();
    console.log('Status:', singleResponse.status);
    console.log('Response:', JSON.stringify(singleData, null, 2));
    console.log('---\n');
    
  } catch (error) {
    console.error('Error testing API:', error.message);
    console.log('Make sure the server is running on port 4000');
  }
}

testPackagesAPI();