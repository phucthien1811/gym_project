import mysql from 'mysql2/promise';
import { config } from './config.js';

const pool = mysql.createPool({
  host: config.db?.host || 'localhost',
  user: config.db?.user || 'root',
  password: config.db?.password || '',
  database: config.db?.name || 'gym_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// BỎ đoạn kiểm tra kết nối ở đây. File index.js sẽ làm việc này.

// Chỉ cần export pool là đủ
export const db = pool;
export default pool;