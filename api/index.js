// File: index.js (PHIÊN BẢN ĐÚNG)

import app from './app.js';
import { config } from './config/config.js';
// QUAN TRỌNG: Import kết nối db từ file database của bạn
import { db } from './config/database.js'; // <-- Sửa lại đường dẫn nếu cần

/**
 * Hàm này sẽ thực hiện 2 việc theo thứ tự:
 * 1. Kiểm tra kết nối database.
 * 2. Nếu kết nối thành công, thì mới khởi động app server.
 */
const startServer = async () => {
  try {
    // Bước 1: Kiểm tra kết nối database bằng một câu lệnh đơn giản
    await db.query('SELECT 1');
    console.log('✅ Database connected successfully.');

    // Bước 2: Khởi động app server bằng biến "app" đã import
    // Sử dụng port từ file config cho nhất quán
    app.listen(config.port, () => {
      console.log(`🚀 API running at http://localhost:${config.port}`);
    });
  } catch (err) {
    // Nếu có lỗi ở bất kỳ bước nào ở trên (chủ yếu là kết nối DB)
    console.error('❌ Server failed to start.', err);
    process.exit(1); // Dừng ứng dụng nếu không kết nối được DB
  }
};

// Gọi hàm để bắt đầu toàn bộ quá trình
startServer();