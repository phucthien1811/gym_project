import userService from '../services/user.js';
import { exportToExcel, presetStyles } from '../utils/excelExporter.js';

class UserController {
  // GET /api/v1/users - Lấy danh sách users
  async getUsers(req, res) {
    try {
      const { page = 1, limit = 10, search = '', status = '' } = req.query;

      const result = await userService.getAllUsers({
        page: parseInt(page),
        limit: parseInt(limit),
        search,
        status
      });

      res.json({
        success: true,
        ...result
      });
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to get users'
      });
    }
  }

  // GET /api/v1/users/stats - Lấy thống kê
  async getStats(req, res) {
    try {
      const stats = await userService.getUserStats();
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Get stats error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to get stats'
      });
    }
  }

  // GET /api/v1/users/:id - Lấy chi tiết user
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(error.message === 'User not found' ? 404 : 500).json({
        success: false,
        message: error.message || 'Failed to get user'
      });
    }
  }

  // POST /api/v1/users - Tạo user mới (Admin only)
  async createUser(req, res) {
    try {
      const { email, password, name, role, phone } = req.body;

      const newUser = await userService.createUser({
        email,
        password,
        name,
        role,
        phone
      });

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: newUser
      });
    } catch (error) {
      console.error('Create user error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create user'
      });
    }
  }

  // PUT /api/v1/users/:id - Cập nhật user (Admin only)
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { email, password, name, role, phone } = req.body;

      const updatedUser = await userService.updateUser(id, {
        email,
        password,
        name,
        role,
        phone
      });

      res.json({
        success: true,
        message: 'User updated successfully',
        data: updatedUser
      });
    } catch (error) {
      console.error('Update user error:', error);
      res.status(error.message === 'User not found' ? 404 : 400).json({
        success: false,
        message: error.message || 'Failed to update user'
      });
    }
  }

  // DELETE /api/v1/users/:id - Xóa user (Admin only)
  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      await userService.deleteUser(id);

      res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(error.message === 'User not found' ? 404 : 400).json({
        success: false,
        message: error.message || 'Failed to delete user'
      });
    }
  }

  // PATCH /api/v1/users/:id/toggle-status - Toggle trạng thái active (Admin only)
  async toggleStatus(req, res) {
    try {
      const { id } = req.params;
      const updatedUser = await userService.toggleUserStatus(id);

      res.json({
        success: true,
        message: `User ${updatedUser.is_active ? 'activated' : 'deactivated'} successfully`,
        data: updatedUser
      });
    } catch (error) {
      console.error('Toggle status error:', error);
      res.status(error.message === 'User not found' ? 404 : 400).json({
        success: false,
        message: error.message || 'Failed to toggle user status'
      });
    }
  }

  // Export users to Excel
  async exportUsers(req, res) {
    try {
      console.log('📊 Export users called');
      console.log('Query params:', req.query);
      
      const { search = '', status = '' } = req.query;

      // Lấy tất cả users (không phân trang)
      const result = await userService.getAllUsers({
        page: 1,
        limit: 10000,
        search,
        status
      });

      const users = result.data || [];

      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Không có dữ liệu để xuất'
        });
      }

      // Helper functions
      const getRoleName = (role) => {
        const roleMap = {
          'admin': 'Quản trị viên',
          'trainer': 'Huấn luyện viên',
          'member': 'Hội viên'
        };
        return roleMap[role] || role;
      };

      // Chuẩn bị data cho Excel
      const excelData = users.map((user, index) => ({
        stt: index + 1,
        name: user.name || 'N/A',
        email: user.email || 'N/A',
        phone: user.phone || 'N/A',
        role: getRoleName(user.role),
        status: user.is_active ? 'Hoạt động' : 'Không hoạt động'
      }));

      // Tạo filter summary
      const filterSummary = [];
      if (search) filterSummary.push(`Tìm kiếm: "${search}"`);
      if (status) filterSummary.push(`Trạng thái: ${status === 'active' ? 'Hoạt động' : 'Không hoạt động'}`);

      const headers = [
        { type: 'title', value: 'DANH SÁCH NGƯỜI DÙNG' },
        { type: 'info', value: `Ngày xuất: ${new Date().toLocaleDateString('vi-VN')} ${new Date().toLocaleTimeString('vi-VN')}` },
        { type: 'info', value: `Tổng số người dùng: ${users.length}` }
      ];

      if (filterSummary.length > 0) {
        headers.push({ type: 'info', value: `Bộ lọc: ${filterSummary.join(', ')}` });
      }

      headers.push({ type: 'empty' });

      // Cấu hình xuất Excel
      const config = {
        fileName: `users_${new Date().toISOString().split('T')[0]}.xlsx`,
        sheetName: 'Danh sách người dùng',
        headers,
        columns: [
          { header: 'STT', key: 'stt', width: 8 },
          { header: 'Họ và Tên', key: 'name', width: 30 },
          { header: 'Email', key: 'email', width: 35 },
          { header: 'Số Điện Thoại', key: 'phone', width: 18 },
          { header: 'Vai Trò', key: 'role', width: 20 },
          { header: 'Trạng Thái', key: 'status', width: 18 }
        ],
        data: excelData,
        styles: presetStyles.blue // Sử dụng theme xanh dương cho users
      };

      // Tạo file Excel
      const buffer = await exportToExcel(config);

      // Gửi file về client
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(config.fileName)}"`);
      res.send(buffer);

    } catch (error) {
      console.error('Export users error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to export users'
      });
    }
  }
}

export default new UserController();
