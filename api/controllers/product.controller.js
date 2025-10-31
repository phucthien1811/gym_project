import productService from '../services/product.service.js';
import { exportToExcel } from '../utils/excelExporter.js';

class ProductController {
  // GET /api/v1/products - Lấy danh sách products
  async getAllProducts(req, res) {
    try {
      const filters = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        category: req.query.category,
        visibility: req.query.visibility,
        status: req.query.status,
        search: req.query.search,
        sortBy: req.query.sortBy,
        order: req.query.order
      };

      const result = await productService.getAllProducts(filters);

      res.json({
        success: true,
        data: result.products,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('Get products error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to get products'
      });
    }
  }

  // GET /api/v1/products/:id - Lấy chi tiết product
  async getProductById(req, res) {
    try {
      const { id } = req.params;
      const product = await productService.getProductById(id);

      res.json({
        success: true,
        data: product
      });
    } catch (error) {
      console.error('Get product error:', error);
      const statusCode = error.message === 'Product not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to get product'
      });
    }
  }

  // POST /api/v1/products - Tạo product mới
  async createProduct(req, res) {
    try {
      const productData = req.body;
      const newProduct = await productService.createProduct(productData);

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: newProduct
      });
    } catch (error) {
      console.error('Create product error:', error);
      const statusCode = error.message.includes('already exists') ? 400 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to create product'
      });
    }
  }

  // PUT /api/v1/products/:id - Cập nhật product
  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const productData = req.body;

      const updatedProduct = await productService.updateProduct(id, productData);

      res.json({
        success: true,
        message: 'Product updated successfully',
        data: updatedProduct
      });
    } catch (error) {
      console.error('Update product error:', error);
      const statusCode = error.message === 'Product not found' ? 404 : 
                         error.message.includes('already exists') ? 400 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to update product'
      });
    }
  }

  // DELETE /api/v1/products/:id - Xóa product
  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      await productService.deleteProduct(id);

      res.json({
        success: true,
        message: 'Product deleted successfully'
      });
    } catch (error) {
      console.error('Delete product error:', error);
      const statusCode = error.message === 'Product not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to delete product'
      });
    }
  }

  // GET /api/v1/products/categories - Lấy danh sách categories
  async getCategories(req, res) {
    try {
      const categories = await productService.getCategories();

      res.json({
        success: true,
        data: categories
      });
    } catch (error) {
      console.error('Get categories error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to get categories'
      });
    }
  }

  // PATCH /api/v1/products/:id/visibility - Toggle visibility
  async toggleVisibility(req, res) {
    try {
      const { id } = req.params;
      const product = await productService.toggleVisibility(id);

      res.json({
        success: true,
        message: 'Product visibility toggled successfully',
        data: product
      });
    } catch (error) {
      console.error('Toggle visibility error:', error);
      const statusCode = error.message === 'Product not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to toggle visibility'
      });
    }
  }

  // PATCH /api/v1/products/:id/stock - Cập nhật stock
  async updateStock(req, res) {
    try {
      const { id } = req.params;
      const { quantity } = req.body;

      if (quantity === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Quantity is required'
        });
      }

      const product = await productService.updateStock(id, quantity);

      res.json({
        success: true,
        message: 'Stock updated successfully',
        data: product
      });
    } catch (error) {
      console.error('Update stock error:', error);
      const statusCode = error.message === 'Product not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to update stock'
      });
    }
  }

  // GET /api/v1/products/export/excel - Xuất Excel
  async exportProductsToExcel(req, res) {
    try {
      // Lấy tất cả sản phẩm (không phân trang)
      const result = await productService.getAllProducts({
        page: 1,
        limit: 10000
      });

      const products = result.products;

      // Chuẩn bị header info
      const headers = [
        { type: 'title', value: 'DANH SÁCH SẢN PHẨM' },
        { type: 'info', value: `Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}` },
        { type: 'info', value: `Tổng số sản phẩm: ${products.length}` },
        { type: 'empty' }
      ];

      // Định nghĩa cột
      const columns = [
        { header: 'STT', key: 'stt', width: 8 },
        { header: 'Mã sản phẩm', key: 'code', width: 15 },
        { header: 'Tên sản phẩm', key: 'name', width: 35 },
        { header: 'Danh mục', key: 'category', width: 20 },
        { header: 'Mô tả', key: 'description', width: 40 },
        { header: 'Giá (VNĐ)', key: 'price', width: 15 },
        { header: 'Số lượng', key: 'stock', width: 12 },
        { header: 'Trạng thái', key: 'status', width: 15 },
        { header: 'Hiển thị', key: 'visibility', width: 12 },
        { header: 'Ngày tạo', key: 'created_at', width: 18 },
        { header: 'Cập nhật cuối', key: 'updated_at', width: 18 }
      ];

      // Chuẩn bị dữ liệu
      const data = products.map((product, index) => ({
        stt: index + 1,
        code: product.code,
        name: product.name,
        category: product.category,
        description: product.description || '',
        price: product.price.toLocaleString('vi-VN'),
        stock: product.stock,
        status: product.status,
        visibility: product.visibility,
        created_at: new Date(product.created_at).toLocaleString('vi-VN'),
        updated_at: new Date(product.updated_at).toLocaleString('vi-VN')
      }));

      // Tạo Excel buffer
      const buffer = await exportToExcel({
        fileName: 'DanhSachSanPham.xlsx',
        sheetName: 'Sản Phẩm',
        headers,
        columns,
        data
      });

      // Set response headers
      const fileName = `DanhSachSanPham_${new Date().toLocaleDateString('vi-VN').replace(/\//g, '-')}.xlsx`;
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`);
      res.setHeader('Content-Length', buffer.length);

      // Send buffer
      res.send(buffer);
    } catch (error) {
      console.error('Export products error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to export products'
      });
    }
  }
}

export default new ProductController();
