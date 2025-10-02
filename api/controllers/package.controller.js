import packageService from '../services/package.service.js';
import packageValidation from '../validations/package.js';

export const packageController = {
  // GET /api/packages - Lấy danh sách packages (admin)
  async getAllPackages(req, res) {
    try {
      const result = await packageService.getAllPackages(req.query);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // GET /api/packages/public - Lấy packages public (member)
  async getPublicPackages(req, res) {
    try {
      const result = await packageService.getPublicPackages();
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // GET /api/packages/:id - Lấy package theo ID
  async getPackageById(req, res) {
    try {
      const { id } = req.params;
      const result = await packageService.getPackageById(id);
      
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

  // POST /api/packages - Tạo package mới
  async createPackage(req, res) {
    try {
      const { error, value } = packageValidation.create.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message
        });
      }

      const result = await packageService.createPackage(value);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // PUT /api/packages/:id - Cập nhật package
  async updatePackage(req, res) {
    try {
      const { id } = req.params;
      const { error, value } = packageValidation.update.validate(req.body);
      
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message
        });
      }

      const result = await packageService.updatePackage(id, value);
      
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

  // DELETE /api/packages/:id - Xóa package
  async deletePackage(req, res) {
    try {
      const { id } = req.params;
      const result = await packageService.deletePackage(id);
      
      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // POST /api/packages/:id/toggle-published - Toggle published status
  async togglePublished(req, res) {
    try {
      const { id } = req.params;
      const result = await packageService.togglePublished(id);
      
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

  // GET /api/packages/:id/members - Lấy danh sách members của package
  async getPackageMembers(req, res) {
    try {
      const { id } = req.params;
      const result = await packageService.getPackageMembers(id, req.query);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
};

export default packageController;