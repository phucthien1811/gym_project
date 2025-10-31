import dashboardService from '../services/dashboard.service.js';
import { successResponse, errorResponse } from '../utils/resonse.js';

class DashboardController {
  // GET /api/v1/dashboard/stats - Lấy tất cả thống kê
  async getDashboardStats(req, res) {
    try {
      const result = await dashboardService.getDashboardStats();
      return successResponse(res, result.data, result.message);
    } catch (error) {
      console.error('Dashboard stats error:', error);
      return errorResponse(res, error.message, 500);
    }
  }
}

export default new DashboardController();
