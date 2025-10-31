import invoiceService from '../services/invoice.service.js';
import { successResponse, errorResponse } from '../utils/resonse.js';

class InvoiceController {
  // Tạo hóa đơn thủ công (từ quầy)
  async createManualInvoice(req, res) {
    try {
      const adminId = req.user.id;
      const result = await invoiceService.createManualInvoice(adminId, req.body);
      return successResponse(res, result.data, result.message, 201);
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  }

  // Lấy danh sách hóa đơn
  async getAllInvoices(req, res) {
    try {
      const { page, limit, source_type, payment_status, search } = req.query;
      
      const filters = {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        source_type,
        payment_status,
        search
      };

      const result = await invoiceService.getAllInvoices(filters);
      return successResponse(res, result.data, result.message);
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  }

  // Lấy chi tiết hóa đơn
  async getInvoiceById(req, res) {
    try {
      const { invoiceId } = req.params;
      const result = await invoiceService.getInvoiceById(invoiceId);
      return successResponse(res, result.data, result.message);
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 400;
      return errorResponse(res, error.message, statusCode);
    }
  }

  // Xác nhận thanh toán
  async confirmPayment(req, res) {
    try {
      const adminId = req.user.id;
      const { invoiceId } = req.params;
      const result = await invoiceService.confirmPayment(invoiceId, adminId, req.body);
      return successResponse(res, result.data, result.message);
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  }

  // Hoàn tiền
  async refundInvoice(req, res) {
    try {
      const adminId = req.user.id;
      const { invoiceId } = req.params;
      const result = await invoiceService.refundInvoice(invoiceId, adminId);
      return successResponse(res, result.data, result.message);
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  }

  // Thống kê doanh thu
  async getRevenueStatistics(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const filters = { startDate, endDate };
      
      const result = await invoiceService.getRevenueStatistics(filters);
      return successResponse(res, result.data, result.message);
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  }

  // Xuất Excel danh sách hóa đơn
  async exportInvoicesToExcel(req, res) {
    try {
      const { source_type, payment_status, search, startDate, endDate } = req.query;
      
      const filters = {
        source_type,
        payment_status,
        search,
        startDate,
        endDate
      };

      const buffer = await invoiceService.exportInvoicesToExcel(filters);
      
      // Set headers cho file Excel
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=Hoa-Don-${new Date().toISOString().split('T')[0]}.xlsx`);
      
      return res.send(buffer);
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  }

  // Xuất PDF một hóa đơn cụ thể
  async exportInvoicePDF(req, res) {
    try {
      const { invoiceId } = req.params;
      const result = await invoiceService.generateInvoicePDF(invoiceId);
      
      // Set headers cho file PDF
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=Hoa-Don-${result.invoiceNumber}.pdf`);
      
      return res.send(result.buffer);
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 400;
      return errorResponse(res, error.message, statusCode);
    }
  }
}

export default new InvoiceController();
