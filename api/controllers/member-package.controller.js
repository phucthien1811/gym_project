import memberPackageService from '../services/member-package.service.js';
import packageValidation from '../validations/package.js';

export const memberPackageController = {
  // GET /api/member-packages - Lấy tất cả member packages (admin)
  async getAllMemberPackages(req, res) {
    try {
      const result = await memberPackageService.getAllMemberPackages(req.query);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // GET /api/member-packages/member/:memberId - Lấy packages của member
  async getMemberPackages(req, res) {
    try {
      const { memberId } = req.params;
      const result = await memberPackageService.getMemberPackages(memberId);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // GET /api/member-packages/member/:memberId/current - Lấy package hiện tại
  async getCurrentPackage(req, res) {
    try {
      const { memberId } = req.params;
      const result = await memberPackageService.getCurrentPackage(memberId);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // POST /api/member-packages/register - Đăng ký package
  async registerPackage(req, res) {
    try {
      // Tạm thời bỏ validation để test
      const { user_id, package_id, paid_amount, notes } = req.body;
      
      console.log('Register package data:', { user_id, package_id, paid_amount, notes });
      
      const result = await memberPackageService.registerPackage(user_id, package_id, paid_amount, notes);
      
      if (!result.success) {
        return res.status(400).json(result);
      }

      res.status(201).json(result);
    } catch (error) {
      console.error('Register package error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // POST /api/member-packages/:id/extend - Gia hạn package
  async extendPackage(req, res) {
    try {
      const { id } = req.params;
      const { error, value } = packageValidation.extend.validate(req.body);
      
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message
        });
      }

      const { days, additional_amount } = value;
      const result = await memberPackageService.extendPackage(id, days, additional_amount);
      
      if (!result.success) {
        return res.status(404).json(result);
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // POST /api/member-packages/:id/cancel - Hủy package
  async cancelPackage(req, res) {
    try {
      const { id } = req.params;
      const { error, value } = packageValidation.cancel.validate(req.body);
      
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message
        });
      }

      const { reason } = value;
      const result = await memberPackageService.cancelPackage(id, reason);
      
      if (!result.success) {
        return res.status(404).json(result);
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // POST /api/member-packages/update-expired - Cập nhật packages hết hạn
  async updateExpiredPackages(req, res) {
    try {
      const result = await memberPackageService.updateExpiredPackages();
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // GET /api/member-packages/stats - Thống kê packages
  async getPackageStats(req, res) {
    try {
      const result = await memberPackageService.getPackageStats();
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
};

export default memberPackageController;