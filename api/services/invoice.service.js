import invoiceRepo from '../repositories/invoice.repo.js';

class InvoiceService {
  // Tạo hóa đơn thủ công từ quầy
  async createManualInvoice(adminId, invoiceData) {
    try {
      const invoiceNumber = await invoiceRepo.generateInvoiceNumber();
      
      const invoice = await invoiceRepo.createManualInvoice({
        invoice_number: invoiceNumber,
        source_type: 'manual',
        source_id: null,
        user_id: invoiceData.user_id,
        customer_name: invoiceData.customer_name,
        customer_email: invoiceData.customer_email || null,
        customer_phone: invoiceData.customer_phone || null,
        item_name: invoiceData.item_name,
        description: invoiceData.description || null,
        quantity: invoiceData.quantity || 1,
        unit_price: invoiceData.unit_price,
        total_amount: invoiceData.total_amount,
        payment_method: invoiceData.payment_method,
        payment_status: invoiceData.amount_paid >= invoiceData.total_amount ? 'paid' : 'pending',
        amount_paid: invoiceData.amount_paid || 0,
        change_amount: invoiceData.change_amount || 0,
        paid_at: invoiceData.amount_paid >= invoiceData.total_amount ? new Date() : null,
        created_by: adminId
      });

      return {
        success: true,
        data: invoice,
        message: 'Invoice created successfully'
      };
    } catch (error) {
      throw new Error(`Failed to create invoice: ${error.message}`);
    }
  }

  // Tạo hóa đơn tự động từ gói tập (được gọi sau khi thanh toán)
  async createGymPackageInvoice(packageData) {
    try {
      const invoice = await invoiceRepo.createGymPackageInvoice(packageData);

      return {
        success: true,
        data: invoice,
        message: 'Gym package invoice created successfully'
      };
    } catch (error) {
      throw new Error(`Failed to create gym package invoice: ${error.message}`);
    }
  }

  // Tạo hóa đơn tự động từ đơn hàng shop (được gọi sau khi tạo order)
  async createShopOrderInvoice(orderData) {
    try {
      const invoice = await invoiceRepo.createShopOrderInvoice(orderData);

      return {
        success: true,
        data: invoice,
        message: 'Shop order invoice created successfully'
      };
    } catch (error) {
      throw new Error(`Failed to create shop order invoice: ${error.message}`);
    }
  }

  // Lấy danh sách hóa đơn
  async getAllInvoices(filters) {
    try {
      const result = await invoiceRepo.getAllInvoices(filters);

      return {
        success: true,
        data: result,
        message: 'Invoices retrieved successfully'
      };
    } catch (error) {
      throw new Error(`Failed to get invoices: ${error.message}`);
    }
  }

  // Lấy chi tiết hóa đơn
  async getInvoiceById(invoiceId) {
    try {
      const invoice = await invoiceRepo.getInvoiceById(invoiceId);
      
      if (!invoice) {
        throw new Error('Invoice not found');
      }

      return {
        success: true,
        data: invoice,
        message: 'Invoice details retrieved successfully'
      };
    } catch (error) {
      throw new Error(`Failed to get invoice: ${error.message}`);
    }
  }

  // Xác nhận thanh toán (cho COD hoặc manual pending)
  async confirmPayment(invoiceId, adminId, paymentData) {
    try {
      const invoice = await invoiceRepo.getInvoiceById(invoiceId);
      
      if (!invoice) {
        throw new Error('Invoice not found');
      }

      if (invoice.payment_status === 'paid') {
        throw new Error('Invoice already paid');
      }

      const updatedInvoice = await invoiceRepo.confirmPayment(invoiceId, adminId, {
        amount_paid: paymentData.amount_paid || invoice.total_amount,
        change_amount: paymentData.change_amount || 0
      });

      return {
        success: true,
        data: updatedInvoice,
        message: 'Payment confirmed successfully'
      };
    } catch (error) {
      throw new Error(`Failed to confirm payment: ${error.message}`);
    }
  }

  // Hoàn tiền
  async refundInvoice(invoiceId, adminId) {
    try {
      const invoice = await invoiceRepo.getInvoiceById(invoiceId);
      
      if (!invoice) {
        throw new Error('Invoice not found');
      }

      if (invoice.payment_status !== 'paid') {
        throw new Error('Can only refund paid invoices');
      }

      const updatedInvoice = await invoiceRepo.refundInvoice(invoiceId, adminId);

      return {
        success: true,
        data: updatedInvoice,
        message: 'Invoice refunded successfully'
      };
    } catch (error) {
      throw new Error(`Failed to refund invoice: ${error.message}`);
    }
  }

  // Thống kê doanh thu
  async getRevenueStatistics(filters) {
    try {
      const stats = await invoiceRepo.getRevenueStatistics(filters);

      return {
        success: true,
        data: stats,
        message: 'Revenue statistics retrieved successfully'
      };
    } catch (error) {
      throw new Error(`Failed to get statistics: ${error.message}`);
    }
  }
}

export default new InvoiceService();
