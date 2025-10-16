import knex from '../config/knex.js';

class InvoiceRepository {
  // Tạo hóa đơn thủ công (từ quầy)
  async createManualInvoice(invoiceData) {
    const [invoice] = await knex('invoices')
      .insert(invoiceData)
      .returning('*');
    return invoice;
  }

  // Tạo hóa đơn tự động từ gói tập
  async createGymPackageInvoice(packageData) {
    const invoiceNumber = await this.generateInvoiceNumber();
    
    const [invoice] = await knex('invoices')
      .insert({
        invoice_number: invoiceNumber,
        source_type: 'gym_package',
        source_id: packageData.member_package_id,
        user_id: packageData.user_id,
        customer_name: packageData.customer_name,
        customer_email: packageData.customer_email,
        customer_phone: packageData.customer_phone,
        item_name: packageData.package_name,
        description: `Đăng ký gói tập ${packageData.package_name}`,
        quantity: 1,
        unit_price: packageData.price,
        total_amount: packageData.total_amount,
        payment_method: packageData.payment_method || 'banking',
        payment_status: 'paid', // Gói tập luôn paid sau khi thanh toán
        amount_paid: packageData.total_amount,
        change_amount: 0,
        paid_at: knex.fn.now()
      })
      .returning('*');
    
    return invoice;
  }

  // Tạo hóa đơn tự động từ đơn hàng shop
  async createShopOrderInvoice(orderData) {
    const invoiceNumber = await this.generateInvoiceNumber();
    
    // Xác định trạng thái thanh toán
    // Nếu dùng voucher giảm còn 0đ hoặc thanh toán banking => paid
    // Nếu COD và còn tiền phải trả => pending
    const isPaidByVoucher = orderData.total_amount === 0 && orderData.discount_amount > 0;
    const paymentStatus = (orderData.payment_method === 'COD' && !isPaidByVoucher) ? 'pending' : 'paid';
    const paidAt = paymentStatus === 'paid' ? knex.fn.now() : null;
    
    const [invoice] = await knex('invoices')
      .insert({
        invoice_number: invoiceNumber,
        source_type: 'shop_order',
        source_id: orderData.order_id,
        user_id: orderData.user_id,
        customer_name: orderData.shipping_address.full_name,
        customer_email: orderData.customer_email,
        customer_phone: orderData.shipping_address.phone,
        item_name: orderData.items_summary, // Tóm tắt sản phẩm
        description: orderData.notes || 'Đơn hàng shop',
        quantity: orderData.total_items,
        unit_price: orderData.total_amount / orderData.total_items,
        total_amount: orderData.total_amount,
        voucher_code: orderData.voucher_code || null,
        discount_amount: orderData.discount_amount || 0,
        payment_method: orderData.payment_method.toLowerCase(),
        payment_status: paymentStatus,
        amount_paid: paymentStatus === 'paid' ? orderData.total_amount : 0,
        change_amount: 0,
        paid_at: paidAt
      })
      .returning('*');
    
    return invoice;
  }

  // Lấy tất cả hóa đơn với filter
  async getAllInvoices(filters = {}) {
    let query = knex('invoices')
      .select(
        'invoices.*',
        'users.name as customer_name_full',
        'users.email as user_email'
      )
      .leftJoin('users', 'invoices.user_id', 'users.id')
      .orderBy('invoices.created_at', 'desc');

    if (filters.source_type) {
      query = query.where('invoices.source_type', filters.source_type);
    }

    if (filters.payment_status) {
      query = query.where('invoices.payment_status', filters.payment_status);
    }

    if (filters.search) {
      query = query.where(function() {
        this.where('invoices.invoice_number', 'like', `%${filters.search}%`)
          .orWhere('invoices.customer_name', 'like', `%${filters.search}%`)
          .orWhere('users.name', 'like', `%${filters.search}%`);
      });
    }

    if (filters.page && filters.limit) {
      const offset = (filters.page - 1) * filters.limit;
      query = query.limit(filters.limit).offset(offset);
    }

    const invoices = await query;
    const [{ total }] = await knex('invoices').count('* as total');

    return {
      invoices,
      total: parseInt(total),
      page: filters.page || 1,
      limit: filters.limit || 10
    };
  }

  // Lấy chi tiết hóa đơn
  async getInvoiceById(invoiceId) {
    const invoice = await knex('invoices')
      .select(
        'invoices.*',
        'users.name as user_name',
        'users.email as user_email',
        'created_by_user.name as created_by_name',
        'confirmed_by_user.name as confirmed_by_name'
      )
      .leftJoin('users', 'invoices.user_id', 'users.id')
      .leftJoin('users as created_by_user', 'invoices.created_by', 'created_by_user.id')
      .leftJoin('users as confirmed_by_user', 'invoices.confirmed_by', 'confirmed_by_user.id')
      .where('invoices.id', invoiceId)
      .first();

    return invoice;
  }

  // Xác nhận thanh toán (cho COD)
  async confirmPayment(invoiceId, adminId, paymentData) {
    await knex('invoices')
      .where('id', invoiceId)
      .update({
        payment_status: 'paid',
        amount_paid: paymentData.amount_paid,
        change_amount: paymentData.change_amount,
        paid_at: knex.fn.now(),
        confirmed_by: adminId,
        updated_at: knex.fn.now()
      });

    // MySQL doesn't support RETURNING, so query again
    const invoice = await this.getInvoiceById(invoiceId);
    return invoice;
  }

  // Hủy/hoàn tiền hóa đơn
  async refundInvoice(invoiceId, adminId) {
    await knex('invoices')
      .where('id', invoiceId)
      .update({
        payment_status: 'refunded',
        confirmed_by: adminId,
        updated_at: knex.fn.now()
      });

    // MySQL doesn't support RETURNING, so query again
    const invoice = await this.getInvoiceById(invoiceId);
    return invoice;
  }

  // Generate invoice number
  async generateInvoiceNumber() {
    const prefix = 'INV';
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    
    // Get today's invoice count
    const [{ count }] = await knex('invoices')
      .whereRaw('DATE(created_at) = CURDATE()')
      .count('* as count');
    
    const sequence = String(parseInt(count) + 1).padStart(4, '0');
    
    return `${prefix}${year}${month}${day}${sequence}`;
  }

  // Thống kê doanh thu
  async getRevenueStatistics(filters = {}) {
    let query = knex('invoices')
      .where('payment_status', 'paid');

    if (filters.startDate) {
      query = query.where('paid_at', '>=', filters.startDate);
    }

    if (filters.endDate) {
      query = query.where('paid_at', '<=', filters.endDate);
    }

    const stats = await query
      .select(
        knex.raw('SUM(total_amount) as total_revenue'),
        knex.raw('COUNT(*) as total_invoices'),
        knex.raw('AVG(total_amount) as average_amount'),
        'source_type'
      )
      .groupBy('source_type');

    return stats;
  }
}

export default new InvoiceRepository();
