import { db } from './config/database.js';

async function checkOrders() {
    try {
        const [rows] = await db.execute('SELECT * FROM orders');
        console.log('📊 Total orders in database:', rows.length);
        console.log('📋 Orders:');
        rows.forEach((order, index) => {
            console.log(`${index + 1}. ID: ${order.id}, Order Number: ${order.order_number}, Total: ${order.total_amount}, User ID: ${order.user_id}`);
        });
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

checkOrders();