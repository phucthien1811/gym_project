import { db } from './config/database.js';

async function testAdminAPI() {
    try {
        // Lấy user admin
        const [adminUsers] = await db.execute('SELECT * FROM users WHERE role = ?', ['admin']);
        
        if (adminUsers.length === 0) {
            console.log('❌ No admin user found');
            return;
        }
        
        const admin = adminUsers[0];
        console.log('👤 Admin user:', { id: admin.id, email: admin.email, role: admin.role });
        
        // Test API admin/all
        const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwic3ViIjo0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcyNzY5MDY0NSwiZXhwIjoxNzI3Njk0MjQ1fQ.sTc3JUkW0FFlzI_vxe6_WwfQFR7f5K3l4d06W9OgbI8";
        
        const response = await fetch('http://localhost:4000/api/v1/orders/admin/all', {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('📡 API Response status:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ API Response:', JSON.stringify(data, null, 2));
        } else {
            const errorText = await response.text();
            console.log('❌ API Error:', errorText);
        }
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

testAdminAPI();