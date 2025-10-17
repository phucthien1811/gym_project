import userService from '../services/user.js';

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
}

export default new UserController();
