import { db } from './config/database.js';

async function testGetAllOrders() {
    try {
        // Test direct database query như trong getAllOrders repository
        const page = 1;
        const limit = 10;
        
        console.log('🔍 Testing getAllOrders query...');
        
        const [orders] = await db.execute(`
            SELECT orders.*, users.email as user_email, users.name as user_name
            FROM orders 
            LEFT JOIN users ON orders.user_id = users.id
            ORDER BY orders.created_at DESC
            LIMIT ? OFFSET ?
        `, [limit, (page - 1) * limit]);
        
        console.log('📊 Found orders:', orders.length);
        
        orders.forEach((order, index) => {
            console.log(`${index + 1}. Order ${order.order_number} - User: ${order.user_name || order.user_email} - Total: ${order.total_amount}`);
        });
        
        // Test với no limit để xem tất cả
        console.log('\n🔍 Testing without limit...');
        const [allOrders] = await db.execute(`
            SELECT orders.*, users.email as user_email, users.name as user_name
            FROM orders 
            LEFT JOIN users ON orders.user_id = users.id
            ORDER BY orders.created_at DESC
        `);
        
        console.log('📊 Total orders without limit:', allOrders.length);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

testGetAllOrders();